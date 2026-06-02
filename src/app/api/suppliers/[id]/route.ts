/**
 * @file src/app/api/suppliers/[id]/route.ts
 * @description Supplier detail API — get a single supplier with their products.
 *
 * GET /api/suppliers/[id]
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  const supplier = await prisma.supplier.findUnique({
    where: { id },
    include: {
      region: true,
      user: { select: { fullName: true, email: true } },
      products: {
        where: { isAvailable: true },
        include: {
          foodItem: {
            include: { category: true },
          },
        },
        orderBy: { pricePerKg: 'asc' },
      },
      _count: { select: { purchaseOrders: true } },
    },
  })

  if (!supplier) {
    return errorResponse('NOT_FOUND', `Supplier ${id} not found`, 404)
  }

  return successResponse({
    id: supplier.id,
    name: supplier.name,
    type: supplier.type,
    region: {
      id: supplier.region.id,
      province: supplier.region.province,
      city: supplier.region.city,
      district: supplier.region.district,
    },
    address: supplier.address,
    coordinates:
      supplier.lat && supplier.lng
        ? { lat: Number(supplier.lat), lng: Number(supplier.lng) }
        : null,
    phone: supplier.phone,
    description: supplier.description,
    isVerified: supplier.isVerified,
    user: supplier.user ?? null,
    products: supplier.products.map((p) => ({
      id: p.id,
      foodItem: {
        id: p.foodItem.id,
        name: p.foodItem.name,
        category: p.foodItem.category.name,
      },
      pricePerKg: p.pricePerKg,
      stockKg: p.stockKg ? Number(p.stockKg) : null,
      isAvailable: p.isAvailable,
    })),
    totalOrders: supplier._count.purchaseOrders,
    createdAt: supplier.createdAt.toISOString(),
  })
})
