/**
 * @file src/app/api/kitchens/route.ts
 * @description Kitchen CRUD API.
 *
 * GET  /api/kitchens        — List all kitchens (with pagination)
 * POST /api/kitchens        — Create a new kitchen
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — List kitchens with optional filters */
export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const regionId = searchParams.get('regionId')
  const status = searchParams.get('status')

  const where: Record<string, unknown> = {}
  if (regionId) where.regionId = parseInt(regionId)
  if (status) where.status = status

  const kitchens = await prisma.sppgKitchen.findMany({
    where,
    include: {
      region: true,
      user: { select: { fullName: true, email: true } },
      _count: { select: { dailyMenus: true, purchaseOrders: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const data = kitchens.map((k) => ({
    id: k.id,
    name: k.name,
    manager: k.user.fullName,
    email: k.user.email,
    region: `${k.region.city}, ${k.region.district ?? ''}`.trim(),
    regionId: k.regionId,
    address: k.address,
    dailyBudget: k.dailyBudget,
    dailyPortions: k.dailyPortions,
    status: k.status,
    totalMenus: k._count.dailyMenus,
    totalOrders: k._count.purchaseOrders,
    createdAt: k.createdAt.toISOString(),
  }))

  return successResponse(data)
})

/** POST — Create a new kitchen */
export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json()

  const { userId, name, regionId, address, lat, lng, dailyBudget, dailyPortions } = body

  if (!userId || !name || !regionId) {
    return errorResponse(
      'VALIDATION_ERROR',
      'userId, name, and regionId are required',
      400
    )
  }

  // Verify user exists
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    return errorResponse('NOT_FOUND', `User ${userId} not found`, 404)
  }

  // Verify region exists
  const region = await prisma.region.findUnique({ where: { id: regionId } })
  if (!region) {
    return errorResponse('NOT_FOUND', `Region ${regionId} not found`, 404)
  }

  const kitchen = await prisma.sppgKitchen.create({
    data: {
      userId,
      name,
      regionId,
      address: address ?? null,
      lat: lat ?? null,
      lng: lng ?? null,
      dailyBudget: dailyBudget ?? 10000,
      dailyPortions: dailyPortions ?? 250,
    },
    include: { region: true, user: { select: { fullName: true } } },
  })

  return successResponse(
    {
      id: kitchen.id,
      name: kitchen.name,
      manager: kitchen.user.fullName,
      region: `${kitchen.region.city}, ${kitchen.region.district ?? ''}`.trim(),
      dailyBudget: kitchen.dailyBudget,
      dailyPortions: kitchen.dailyPortions,
      status: kitchen.status,
    },
    201
  )
})
