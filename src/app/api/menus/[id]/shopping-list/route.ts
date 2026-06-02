/**
 * @file src/app/api/menus/[id]/shopping-list/route.ts
 * @description Shopping List API — generates a shopping list from a menu
 *              and matches items with available local suppliers.
 *
 * GET /api/menus/{menuId}/shopping-list
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

export const GET = withErrorHandler(async (
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id: menuId } = await params

  // Fetch the menu with items and kitchen info
  const menu = await prisma.dailyMenu.findUnique({
    where: { id: menuId },
    include: {
      kitchen: { include: { region: true } },
      menuItems: {
        include: {
          foodItem: {
            include: {
              category: true,
              supplierProducts: {
                include: {
                  supplier: {
                    select: {
                      id: true,
                      name: true,
                      type: true,
                      phone: true,
                      isVerified: true,
                      description: true,
                    },
                  },
                },
                where: { isAvailable: true },
              },
            },
          },
        },
        orderBy: { displayOrder: 'asc' },
      },
    },
  })

  if (!menu) {
    return errorResponse('NOT_FOUND', `Menu ${menuId} not found`, 404)
  }

  const portionCount = menu.portions ?? 250

  // Build shopping list with supplier matching
  const shoppingItems = menu.menuItems.map((mi) => {
    const totalKg = Number(((Number(mi.quantityGrams) * portionCount) / 1000).toFixed(1))
    const estimatedCostPerKg = mi.cost ? Math.round((mi.cost * 1000) / Number(mi.quantityGrams)) : null

    // Get matched suppliers for this food item
    const matchedSuppliers = mi.foodItem.supplierProducts.map((sp) => ({
      supplierId: sp.supplier.id,
      name: sp.supplier.name,
      type: sp.supplier.type,
      phone: sp.supplier.phone,
      isVerified: sp.supplier.isVerified,
      description: sp.supplier.description,
      pricePerKg: sp.pricePerKg,
      stockKg: sp.stockKg ? Number(sp.stockKg) : null,
    }))

    return {
      foodItemId: mi.foodItemId,
      foodItem: mi.foodItem.name,
      category: mi.foodItem.category.name,
      quantityPerPortion: Number(mi.quantityGrams),
      totalKg,
      estimatedCostPerKg,
      estimatedTotalCost: estimatedCostPerKg ? Math.round(estimatedCostPerKg * totalKg) : null,
      matchedSuppliers,
    }
  })

  return successResponse({
    menuId: menu.id,
    menuDate: menu.menuDate.toISOString().split('T')[0],
    packageName: menu.packageName,
    mainDish: menu.mainDish,
    portions: portionCount,
    costPerPortion: menu.costPerPortion,
    isSubstituted: menu.isSubstituted,
    substitutionReason: menu.substitutionReason,
    shoppingItems,
  })
})
