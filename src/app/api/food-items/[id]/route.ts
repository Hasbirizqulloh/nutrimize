/**
 * @file src/app/api/food-items/[id]/route.ts
 * @description Food Item detail API — get a single food item by ID.
 *
 * GET /api/food-items/[id]
 *   - Includes category, market prices (latest), and supplier availability
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const foodItemId = parseInt(id)

  if (isNaN(foodItemId)) {
    return errorResponse('INVALID_PARAM', 'ID must be a number', 400)
  }

  const foodItem = await prisma.foodItem.findUnique({
    where: { id: foodItemId },
    include: {
      category: true,
      marketPrices: {
        orderBy: { priceDate: 'desc' },
        take: 7,
        include: { region: true },
      },
      supplierProducts: {
        where: { isAvailable: true },
        include: {
          supplier: {
            select: { id: true, name: true, type: true, phone: true, isVerified: true },
          },
        },
      },
    },
  })

  if (!foodItem) {
    return errorResponse('NOT_FOUND', `Food item with ID ${id} not found`, 404)
  }

  return successResponse({
    id: foodItem.id,
    name: foodItem.name,
    category: foodItem.category.name,
    categoryId: foodItem.categoryId,
    nutrition: {
      calories: Number(foodItem.calories),
      protein: Number(foodItem.protein),
      carbohydrates: Number(foodItem.carbohydrates),
      fat: Number(foodItem.fat),
      fiber: Number(foodItem.fiber),
    },
    unit: foodItem.unit,
    isLocal: foodItem.isLocal,
    localRegions: foodItem.localRegions,
    description: foodItem.description,
    recentPrices: foodItem.marketPrices.map((mp) => ({
      pricePerKg: mp.pricePerKg,
      date: mp.priceDate.toISOString().split('T')[0],
      region: `${mp.region.city} — ${mp.region.district ?? ''}`.trim(),
      source: mp.source,
    })),
    availableFrom: foodItem.supplierProducts.map((sp) => ({
      supplier: sp.supplier,
      pricePerKg: sp.pricePerKg,
      stockKg: sp.stockKg ? Number(sp.stockKg) : null,
    })),
  })
})
