/**
 * @file src/app/api/waste/route.ts
 * @description Waste Logs API — log and retrieve food waste data.
 *
 * GET  /api/waste?kitchenId=xxx&days=7  — Get waste log history
 * POST /api/waste                        — Log waste for a menu
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — Get waste log trends for a kitchen */
export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const kitchenId = searchParams.get('kitchenId') ?? 'kitchen-bwi-001'
  const days = Math.min(30, Math.max(1, parseInt(searchParams.get('days') ?? '7')))

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const wasteLogs = await prisma.wasteLog.findMany({
    where: {
      menu: { kitchenId },
      logDate: { gte: startDate },
    },
    include: {
      foodItem: { include: { category: true } },
      menu: { select: { packageName: true, mainDish: true, menuDate: true } },
    },
    orderBy: { logDate: 'desc' },
  })

  // Group by date for trend view
  const byDate: Record<string, {
    date: string
    menuName: string | null
    avgWaste: number
    items: { foodItem: string; category: string; wastePercentage: number; notes: string | null }[]
  }> = {}

  for (const log of wasteLogs) {
    const dateKey = log.logDate.toISOString().split('T')[0]
    if (!byDate[dateKey]) {
      byDate[dateKey] = {
        date: dateKey,
        menuName: log.menu.mainDish ?? log.menu.packageName,
        avgWaste: 0,
        items: [],
      }
    }
    byDate[dateKey].items.push({
      foodItem: log.foodItem.name,
      category: log.foodItem.category.name,
      wastePercentage: Number(log.wastePercentage),
      notes: log.notes,
    })
  }

  // Calculate daily averages
  for (const entry of Object.values(byDate)) {
    entry.avgWaste = Number(
      (entry.items.reduce((sum, i) => sum + i.wastePercentage, 0) / entry.items.length).toFixed(1)
    )
  }

  const trend = Object.values(byDate).sort((a, b) => a.date.localeCompare(b.date))

  // Overall summary
  const allWastes = wasteLogs.map((w) => Number(w.wastePercentage))
  const summary = {
    avgWastePercentage: allWastes.length > 0
      ? Number((allWastes.reduce((a, b) => a + b, 0) / allWastes.length).toFixed(1))
      : 0,
    highWasteItems: wasteLogs
      .filter((w) => Number(w.wastePercentage) > 25)
      .map((w) => ({
        foodItem: w.foodItem.name,
        wastePercentage: Number(w.wastePercentage),
        date: w.logDate.toISOString().split('T')[0],
      })),
    totalLogs: wasteLogs.length,
  }

  return successResponse({ summary, trend })
})

/** POST — Log waste for a specific menu's items */
export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json()
  const { menuId, logs } = body

  if (!menuId || !logs || !Array.isArray(logs) || logs.length === 0) {
    return errorResponse(
      'VALIDATION_ERROR',
      'menuId and logs[] (array of { foodItemId, wastePercentage, notes? }) are required',
      400
    )
  }

  // Verify menu exists
  const menu = await prisma.dailyMenu.findUnique({ where: { id: menuId } })
  if (!menu) {
    return errorResponse('NOT_FOUND', `Menu ${menuId} not found`, 404)
  }

  const logDate = new Date(menu.menuDate)
  logDate.setHours(0, 0, 0, 0)

  const created = []
  for (const log of logs as { foodItemId: number; wastePercentage: number; notes?: string }[]) {
    if (log.wastePercentage < 0 || log.wastePercentage > 100) {
      return errorResponse(
        'VALIDATION_ERROR',
        `wastePercentage must be 0-100 (got ${log.wastePercentage} for foodItemId ${log.foodItemId})`,
        400
      )
    }

    const entry = await prisma.wasteLog.upsert({
      where: { menuId_foodItemId: { menuId, foodItemId: log.foodItemId } },
      update: {
        wastePercentage: log.wastePercentage,
        notes: log.notes ?? null,
      },
      create: {
        menuId,
        foodItemId: log.foodItemId,
        wastePercentage: log.wastePercentage,
        logDate,
        notes: log.notes ?? null,
      },
    })
    created.push(entry)
  }

  // Update menu status to EVALUATED if it was SERVED
  if (menu.status === 'SERVED') {
    await prisma.dailyMenu.update({
      where: { id: menuId },
      data: { status: 'EVALUATED' },
    })
  }

  return successResponse(
    {
      menuId,
      logsCreated: created.length,
      menuStatus: menu.status === 'SERVED' ? 'EVALUATED' : menu.status,
    },
    201
  )
})
