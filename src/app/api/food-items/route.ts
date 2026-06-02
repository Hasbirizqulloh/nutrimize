/**
 * @file src/app/api/food-items/route.ts
 * @description Food Items API — list and filter food items.
 *
 * GET /api/food-items
 *   Query params:
 *     - categoryId: Filter by food category (number)
 *     - isLocal: Filter by local availability (boolean)
 *     - search: Search by name (string)
 *     - page: Page number (default 1)
 *     - limit: Items per page (default 50)
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)

  const categoryId = searchParams.get('categoryId')
  const isLocal = searchParams.get('isLocal')
  const search = searchParams.get('search')
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '50')))
  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}
  if (categoryId) where.categoryId = parseInt(categoryId)
  if (isLocal !== null && isLocal !== undefined && isLocal !== '') {
    where.isLocal = isLocal === 'true'
  }
  if (search) {
    where.name = { contains: search, mode: 'insensitive' }
  }

  const [foodItems, total] = await Promise.all([
    prisma.foodItem.findMany({
      where,
      include: { category: true },
      orderBy: [{ categoryId: 'asc' }, { name: 'asc' }],
      skip,
      take: limit,
    }),
    prisma.foodItem.count({ where }),
  ])

  const items = foodItems.map((fi) => ({
    id: fi.id,
    name: fi.name,
    category: fi.category.name,
    categoryId: fi.categoryId,
    nutrition: {
      calories: Number(fi.calories),
      protein: Number(fi.protein),
      carbohydrates: Number(fi.carbohydrates),
      fat: Number(fi.fat),
      fiber: Number(fi.fiber),
    },
    unit: fi.unit,
    isLocal: fi.isLocal,
    localRegions: fi.localRegions,
    description: fi.description,
  }))

  return successResponse(items, 200, { total, page, limit })
})
