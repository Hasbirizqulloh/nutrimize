/**
 * @file src/app/api/prices/trends/route.ts
 * @description Price Trends API — get price history over time.
 *
 * GET /api/prices/trends?regionId=1&foodItemId=1&days=7
 *   - Returns price trend for a specific food item in a region over N days
 *   - If foodItemId not specified, returns trends for top 5 items by price
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const regionId = parseInt(searchParams.get('regionId') ?? '1')
  const foodItemId = searchParams.get('foodItemId')
  const days = Math.min(90, Math.max(1, parseInt(searchParams.get('days') ?? '7')))

  if (isNaN(regionId)) {
    return errorResponse('INVALID_PARAM', 'regionId must be a number', 400)
  }

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const where: Record<string, unknown> = {
    regionId,
    priceDate: { gte: startDate },
  }
  if (foodItemId) {
    where.foodItemId = parseInt(foodItemId)
  }

  const prices = await prisma.marketPrice.findMany({
    where,
    include: {
      foodItem: { select: { name: true, id: true } },
    },
    orderBy: [{ foodItemId: 'asc' }, { priceDate: 'asc' }],
  })

  // Group by food item
  const grouped: Record<number, {
    foodItemId: number
    foodItem: string
    prices: { date: string; pricePerKg: number }[]
  }> = {}

  for (const p of prices) {
    if (!grouped[p.foodItemId]) {
      grouped[p.foodItemId] = {
        foodItemId: p.foodItemId,
        foodItem: p.foodItem.name,
        prices: [],
      }
    }
    grouped[p.foodItemId].prices.push({
      date: p.priceDate.toISOString().split('T')[0],
      pricePerKg: p.pricePerKg,
    })
  }

  // Calculate price change percentage
  const trends = Object.values(grouped).map((g) => {
    const firstPrice = g.prices[0]?.pricePerKg ?? 0
    const lastPrice = g.prices[g.prices.length - 1]?.pricePerKg ?? 0
    const changePercent = firstPrice > 0
      ? Number((((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1))
      : 0

    return {
      ...g,
      latestPrice: lastPrice,
      changePercent,
      trend: changePercent > 2 ? 'UP' : changePercent < -2 ? 'DOWN' : 'STABLE',
    }
  })

  return successResponse(trends)
})
