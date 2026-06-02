/**
 * @file src/app/api/menus/[id]/route.ts
 * @description Menu detail & status update API.
 *
 * GET   /api/menus/[id]   — Get menu detail
 * PATCH /api/menus/[id]   — Update menu status (DRAFT → CONFIRMED → SERVED → EVALUATED)
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — Menu detail with items, waste logs, purchase orders */
export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  const menu = await prisma.dailyMenu.findUnique({
    where: { id },
    include: {
      kitchen: { select: { name: true, dailyBudget: true } },
      menuItems: {
        include: {
          foodItem: { include: { category: true } },
        },
        orderBy: { displayOrder: 'asc' },
      },
      wasteLogs: {
        include: { foodItem: { select: { name: true } } },
      },
      purchaseOrders: {
        include: {
          supplier: { select: { name: true, type: true } },
          items: {
            include: { foodItem: { select: { name: true } } },
          },
        },
      },
    },
  })

  if (!menu) {
    return errorResponse('NOT_FOUND', `Menu ${id} not found`, 404)
  }

  return successResponse({
    id: menu.id,
    kitchen: menu.kitchen,
    menuDate: menu.menuDate.toISOString().split('T')[0],
    packageName: menu.packageName,
    mainDish: menu.mainDish,
    nutrition: {
      calories: menu.totalCalories ? Number(menu.totalCalories) : null,
      protein: menu.totalProtein ? Number(menu.totalProtein) : null,
      carbs: menu.totalCarbs ? Number(menu.totalCarbs) : null,
      fat: menu.totalFat ? Number(menu.totalFat) : null,
    },
    costPerPortion: menu.costPerPortion,
    totalCost: menu.totalCost,
    portions: menu.portions,
    status: menu.status,
    isAiOptimized: menu.isAiOptimized,
    isSubstituted: menu.isSubstituted,
    substitutionReason: menu.substitutionReason,
    recipeGuide: menu.recipeGuide,
    items: menu.menuItems.map((mi) => ({
      id: mi.id,
      foodItem: {
        id: mi.foodItem.id,
        name: mi.foodItem.name,
        category: mi.foodItem.category.name,
      },
      quantityGrams: Number(mi.quantityGrams),
      cost: mi.cost,
    })),
    wasteLogs: menu.wasteLogs.map((wl) => ({
      id: wl.id,
      foodItem: wl.foodItem.name,
      wastePercentage: Number(wl.wastePercentage),
      notes: wl.notes,
    })),
    purchaseOrders: menu.purchaseOrders.map((po) => ({
      id: po.id,
      supplier: po.supplier.name,
      supplierType: po.supplier.type,
      totalAmount: po.totalAmount,
      status: po.status,
      items: po.items.map((item) => ({
        foodItem: item.foodItem.name,
        quantityKg: Number(item.quantityKg),
        pricePerKg: item.pricePerKg,
        subtotal: item.subtotal,
      })),
    })),
  })
})

/** PATCH — Update menu status */
export const PATCH = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()

  const existing = await prisma.dailyMenu.findUnique({ where: { id } })
  if (!existing) {
    return errorResponse('NOT_FOUND', `Menu ${id} not found`, 404)
  }

  // Valid status transitions
  const validTransitions: Record<string, string[]> = {
    DRAFT: ['CONFIRMED'],
    CONFIRMED: ['SERVED'],
    SERVED: ['EVALUATED'],
    EVALUATED: [],
  }

  if (body.status) {
    const allowed = validTransitions[existing.status] ?? []
    if (!allowed.includes(body.status)) {
      return errorResponse(
        'INVALID_TRANSITION',
        `Cannot transition from ${existing.status} to ${body.status}. Allowed: ${allowed.join(', ') || 'none'}`,
        400
      )
    }
  }

  const updated = await prisma.dailyMenu.update({
    where: { id },
    data: {
      status: body.status ?? existing.status,
      packageName: body.packageName ?? existing.packageName,
      mainDish: body.mainDish ?? existing.mainDish,
    },
  })

  return successResponse({
    id: updated.id,
    status: updated.status,
    updatedAt: updated.updatedAt.toISOString(),
  })
})
