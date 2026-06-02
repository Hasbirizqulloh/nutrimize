/**
 * @file src/app/api/dashboard/kpi/route.ts
 * @description Dashboard KPI API — aggregated statistics for the main dashboard.
 *
 * GET /api/dashboard/kpi?kitchenId=xxx
 *
 * Returns:
 *   - costPerPortion (avg today)
 *   - totalPortions (today)
 *   - nutritionScore (% of target met)
 *   - wastePercentage (avg last 7 days)
 *   - todayMenu summary
 *   - weeklyTrend (cost + waste over 7 days)
 *   - pendingOrders count
 *   - suppliersNearby count
 */

import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const kitchenId = searchParams.get('kitchenId') ?? 'kitchen-bwi-001'

  // Verify kitchen exists
  const kitchen = await prisma.sppgKitchen.findUnique({
    where: { id: kitchenId },
    include: { region: true },
  })

  if (!kitchen) {
    return errorResponse('NOT_FOUND', `Kitchen ${kitchenId} not found`, 404)
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // 1. Today's menu (or tomorrow's if today doesn't exist — for demo flow)
  const menuInclude = {
    menuItems: {
      include: { foodItem: { include: { category: true } } },
      orderBy: { displayOrder: 'asc' as const },
    },
  }

  let todayMenu = await prisma.dailyMenu.findUnique({
    where: { kitchenId_menuDate: { kitchenId, menuDate: today } },
    include: menuInclude,
  })

  // Fallback: if no menu for today, check tomorrow (calculator generates for tomorrow)
  if (!todayMenu) {
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    todayMenu = await prisma.dailyMenu.findUnique({
      where: { kitchenId_menuDate: { kitchenId, menuDate: tomorrow } },
      include: menuInclude,
    })
  }

  // 2. Weekly menus for trend
  const weeklyMenus = await prisma.dailyMenu.findMany({
    where: {
      kitchenId,
      menuDate: { gte: sevenDaysAgo, lte: today },
    },
    orderBy: { menuDate: 'asc' },
  })

  // 3. Waste logs for the last 7 days
  const wasteLogs = await prisma.wasteLog.findMany({
    where: {
      menu: { kitchenId },
      logDate: { gte: sevenDaysAgo, lte: today },
    },
  })

  // 4. Pending purchase orders
  const pendingOrders = await prisma.purchaseOrder.count({
    where: { kitchenId, status: { in: ['PENDING', 'SENT'] } },
  })

  // 5. Nearby suppliers (same region)
  const suppliersNearby = await prisma.supplier.count({
    where: { regionId: kitchen.regionId, isVerified: true },
  })

  // Calculate KPIs
  const avgCostPerPortion = todayMenu?.costPerPortion ?? 0
  const totalPortions = todayMenu?.portions ?? kitchen.dailyPortions

  // Nutrition score: percentage of AKG met (simplified)
  let nutritionScore = 0
  if (todayMenu) {
    const cal = Number(todayMenu.totalCalories ?? 0)
    const prot = Number(todayMenu.totalProtein ?? 0)
    const calScore = Math.min(100, (cal / 800) * 100)
    const protScore = Math.min(100, (prot / 15) * 100)
    nutritionScore = Math.round((calScore + protScore) / 2)
  }

  // Average waste percentage (last 7 days)
  const avgWaste =
    wasteLogs.length > 0
      ? Number(
          (
            wasteLogs.reduce((sum, w) => sum + Number(w.wastePercentage), 0) /
            wasteLogs.length
          ).toFixed(1)
        )
      : 0

  // Weekly cost trend
  const weeklyTrend = weeklyMenus.map((m) => ({
    date: m.menuDate.toISOString().split('T')[0],
    costPerPortion: m.costPerPortion ?? 0,
    status: m.status,
  }))

  return successResponse({
    kitchen: {
      id: kitchen.id,
      name: kitchen.name,
      region: `${kitchen.region.city}, ${kitchen.region.district ?? ''}`.trim(),
      dailyBudget: kitchen.dailyBudget,
      dailyPortions: kitchen.dailyPortions,
      status: kitchen.status,
    },
    kpi: {
      costPerPortion: avgCostPerPortion,
      totalPortions,
      nutritionScore,
      wastePercentage: avgWaste,
      pendingOrders,
      suppliersNearby,
    },
    todayMenu: todayMenu
      ? {
          id: todayMenu.id,
          packageName: todayMenu.packageName,
          mainDish: todayMenu.mainDish,
          status: todayMenu.status,
          isAiOptimized: todayMenu.isAiOptimized,
          isSubstituted: todayMenu.isSubstituted,
          substitutionReason: todayMenu.substitutionReason,
          recipeGuide: todayMenu.recipeGuide,
          nutrition: {
            calories: Number(todayMenu.totalCalories),
            protein: Number(todayMenu.totalProtein),
            carbs: Number(todayMenu.totalCarbs),
            fat: Number(todayMenu.totalFat),
          },
          costPerPortion: todayMenu.costPerPortion,
          totalCost: todayMenu.totalCost,
          portions: todayMenu.portions,
          items: todayMenu.menuItems.map((mi) => ({
            id: mi.id,
            foodItem: mi.foodItem.name,
            category: mi.foodItem.category.name,
            quantityGrams: Number(mi.quantityGrams),
            cost: mi.cost,
          })),
        }
      : null,
    weeklyTrend,
  })
})
