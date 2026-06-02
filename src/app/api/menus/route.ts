/**
 * @file src/app/api/menus/route.ts
 * @description Daily Menus API — list, create, and manage daily menus.
 *
 * GET  /api/menus?kitchenId=xxx&days=7  — Get recent menus
 * POST /api/menus                        — Create a new menu (from AI result)
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — List menus for a kitchen, sorted by date descending */
export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const kitchenId = searchParams.get('kitchenId') ?? 'kitchen-bwi-001'
  const days = Math.min(30, Math.max(1, parseInt(searchParams.get('days') ?? '7')))
  const status = searchParams.get('status')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)
  startDate.setHours(0, 0, 0, 0)

  const where: Record<string, unknown> = {
    kitchenId,
    menuDate: { gte: startDate },
  }
  if (status) where.status = status

  const menus = await prisma.dailyMenu.findMany({
    where,
    include: {
      menuItems: {
        include: {
          foodItem: { include: { category: true } },
        },
        orderBy: { displayOrder: 'asc' },
      },
      _count: { select: { wasteLogs: true, purchaseOrders: true } },
    },
    orderBy: { menuDate: 'desc' },
  })

  const data = menus.map((m) => ({
    id: m.id,
    menuDate: m.menuDate.toISOString().split('T')[0],
    packageName: m.packageName,
    mainDish: m.mainDish,
    nutrition: {
      calories: m.totalCalories ? Number(m.totalCalories) : null,
      protein: m.totalProtein ? Number(m.totalProtein) : null,
      carbs: m.totalCarbs ? Number(m.totalCarbs) : null,
      fat: m.totalFat ? Number(m.totalFat) : null,
    },
    costPerPortion: m.costPerPortion,
    totalCost: m.totalCost,
    portions: m.portions,
    status: m.status,
    isAiOptimized: m.isAiOptimized,
    isSubstituted: m.isSubstituted,
    substitutionReason: m.substitutionReason,
    recipeGuide: m.recipeGuide,
    items: m.menuItems.map((mi) => ({
      id: mi.id,
      foodItem: mi.foodItem.name,
      category: mi.foodItem.category.name,
      quantityGrams: Number(mi.quantityGrams),
      cost: mi.cost,
    })),
    hasWasteLogs: m._count.wasteLogs > 0,
    hasOrders: m._count.purchaseOrders > 0,
  }))

  return successResponse(data, 200, { total: data.length })
})

/** POST — Create a new daily menu from AI optimization result */
export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json()

  const {
    kitchenId, menuDate, packageName, mainDish,
    totalCalories, totalProtein, totalCarbs, totalFat,
    costPerPortion, portions,
    isAiOptimized, isSubstituted, substitutionReason, recipeGuide,
    items, // Array of { foodItemId, quantityGrams, cost }
  } = body

  if (!kitchenId || !menuDate || !items || !Array.isArray(items) || items.length === 0) {
    return errorResponse(
      'VALIDATION_ERROR',
      'kitchenId, menuDate, and items[] are required',
      400
    )
  }

  // Check kitchen exists
  const kitchen = await prisma.sppgKitchen.findUnique({ where: { id: kitchenId } })
  if (!kitchen) {
    return errorResponse('NOT_FOUND', `Kitchen ${kitchenId} not found`, 404)
  }

  const parsedDate = new Date(menuDate)
  parsedDate.setHours(0, 0, 0, 0)

  const totalCost = costPerPortion && portions ? costPerPortion * portions : null

  // Check for existing menu for this date
  const existingMenu = await prisma.dailyMenu.findUnique({
    where: { kitchenId_menuDate: { kitchenId, menuDate: parsedDate } },
    select: { id: true },
  })

  // If it exists, clear its items first so we can replace them
  if (existingMenu) {
    await prisma.menuItem.deleteMany({
      where: { menuId: existingMenu.id },
    })
  }

  const menuData = {
    kitchenId,
    menuDate: parsedDate,
    packageName: packageName ?? null,
    mainDish: mainDish ?? null,
    totalCalories: totalCalories ?? null,
    totalProtein: totalProtein ?? null,
    totalCarbs: totalCarbs ?? null,
    totalFat: totalFat ?? null,
    costPerPortion: costPerPortion ?? null,
    totalCost,
    portions: portions ?? kitchen.dailyPortions,
    isAiOptimized: isAiOptimized ?? false,
    isSubstituted: isSubstituted ?? false,
    substitutionReason: substitutionReason ?? null,
    recipeGuide: recipeGuide ?? null,
    status: 'DRAFT' as const,
    menuItems: {
      create: items.map((item: { foodItemId: number; quantityGrams: number; cost?: number }, index: number) => ({
        foodItemId: item.foodItemId,
        quantityGrams: item.quantityGrams,
        cost: item.cost ?? null,
        displayOrder: index + 1,
      })),
    },
  }

  const menu = await prisma.dailyMenu.upsert({
    where: { kitchenId_menuDate: { kitchenId, menuDate: parsedDate } },
    update: menuData,
    create: menuData,
    include: {
      menuItems: {
        include: { foodItem: { select: { name: true } } },
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  return successResponse(
    {
      id: menu.id,
      menuDate: menu.menuDate.toISOString().split('T')[0],
      packageName: menu.packageName,
      mainDish: menu.mainDish,
      status: menu.status,
      items: menu.menuItems.map((mi) => ({
        foodItem: mi.foodItem.name,
        quantityGrams: Number(mi.quantityGrams),
        cost: mi.cost,
      })),
    },
    201
  )
})
