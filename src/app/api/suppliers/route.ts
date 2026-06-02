/**
 * @file src/app/api/suppliers/route.ts
 * @description Suppliers API — list, filter, and search nearby suppliers.
 *
 * GET /api/suppliers
 *   Query params:
 *     - regionId: Filter by region (number)
 *     - type: Filter by supplier type (GAPOKTAN, UMKM, NELAYAN, PETERNAK, OTHER)
 *     - verified: Filter by verification status (boolean)
 *     - search: Search by name (string)
 *     - lat, lng, radius: Nearby search (decimal, decimal, km)
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/**
 * Calculate distance between two coordinates using the Haversine formula.
 * @returns Distance in kilometers
 */
function haversineDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)

  const regionId = searchParams.get('regionId')
  const type = searchParams.get('type')
  const verified = searchParams.get('verified')
  const search = searchParams.get('search')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const radius = parseFloat(searchParams.get('radius') ?? '10') // default 10km

  const where: Record<string, unknown> = {}
  if (regionId) where.regionId = parseInt(regionId)
  if (type) where.type = type
  if (verified !== null && verified !== '') where.isVerified = verified === 'true'
  if (search) where.name = { contains: search, mode: 'insensitive' }

  const suppliers = await prisma.supplier.findMany({
    where,
    include: {
      region: true,
      _count: { select: { products: true, purchaseOrders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  let result = suppliers.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    region: `${s.region.city}, ${s.region.district ?? ''}`.trim(),
    regionId: s.regionId,
    address: s.address,
    coordinates:
      s.lat && s.lng ? { lat: Number(s.lat), lng: Number(s.lng) } : null,
    phone: s.phone,
    description: s.description,
    isVerified: s.isVerified,
    totalProducts: s._count.products,
    totalOrders: s._count.purchaseOrders,
    distance: null as number | null,
  }))

  // Apply nearby filter if lat/lng provided
  if (lat && lng) {
    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)

    result = result
      .map((s) => {
        if (s.coordinates) {
          const dist = haversineDistance(
            userLat, userLng,
            s.coordinates.lat, s.coordinates.lng
          )
          return { ...s, distance: Math.round(dist * 10) / 10 }
        }
        return s
      })
      .filter((s) => s.distance !== null && s.distance <= radius)
      .sort((a, b) => (a.distance ?? 999) - (b.distance ?? 999))
  }

  return successResponse(result, 200, { total: result.length })
})
