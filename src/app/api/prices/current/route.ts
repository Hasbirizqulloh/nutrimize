/**
 * @file src/app/api/prices/current/route.ts
 * @description Market Prices API — get current prices for a region.
 *
 * GET /api/prices/current?regionId=1
 *   - Returns latest prices for all food items in the specified region
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const regionId = parseInt(searchParams.get('regionId') ?? '1')

  if (isNaN(regionId)) {
    return errorResponse('INVALID_PARAM', 'regionId must be a number', 400)
  }

  // Get the latest price for each food item in the region
  // We use a raw approach: get all recent prices, then deduplicate by foodItemId
  const prices = await prisma.marketPrice.findMany({
    where: { regionId },
    orderBy: { priceDate: 'desc' },
    include: {
      foodItem: {
        include: { category: true },
      },
      region: true,
    },
  })

  // Deduplicate: keep only the latest price per food item
  const latestPrices = new Map<number, typeof prices[0]>()
  for (const price of prices) {
    if (!latestPrices.has(price.foodItemId)) {
      latestPrices.set(price.foodItemId, price)
    }
  }

  const data = Array.from(latestPrices.values()).map((p) => ({
    foodItemId: p.foodItemId,
    foodItem: p.foodItem.name,
    category: p.foodItem.category.name,
    pricePerKg: p.pricePerKg,
    priceDate: p.priceDate.toISOString().split('T')[0],
    source: p.source,
    region: `${p.region.city}, ${p.region.district ?? ''}`.trim(),
  }))

  return successResponse(data, 200, { total: data.length })
})
