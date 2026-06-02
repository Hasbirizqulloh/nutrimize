/**
 * @file src/app/api/purchase-orders/route.ts
 * @description Purchase Orders API — create and manage purchase orders.
 *
 * GET  /api/purchase-orders?kitchenId=xxx  — List orders
 * POST /api/purchase-orders                 — Create a new PO
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — List purchase orders for a kitchen */
export const GET = withErrorHandler(async (request: Request) => {
  const { searchParams } = new URL(request.url)
  const kitchenId = searchParams.get('kitchenId') ?? 'kitchen-bwi-001'
  const status = searchParams.get('status')
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20')))

  const where: Record<string, unknown> = { kitchenId }
  if (status) where.status = status

  const orders = await prisma.purchaseOrder.findMany({
    where,
    include: {
      supplier: { select: { name: true, type: true, phone: true } },
      menu: { select: { mainDish: true, menuDate: true } },
      items: {
        include: { foodItem: { select: { name: true, unit: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  const data = orders.map((o) => ({
    id: o.id,
    supplier: {
      name: o.supplier.name,
      type: o.supplier.type,
      phone: o.supplier.phone,
    },
    menu: o.menu
      ? {
          mainDish: o.menu.mainDish,
          menuDate: o.menu.menuDate.toISOString().split('T')[0],
        }
      : null,
    orderDate: o.orderDate.toISOString().split('T')[0],
    totalAmount: o.totalAmount,
    status: o.status,
    sentVia: o.sentVia,
    items: o.items.map((item) => ({
      foodItem: item.foodItem.name,
      unit: item.foodItem.unit,
      quantityKg: Number(item.quantityKg),
      pricePerKg: item.pricePerKg,
      subtotal: item.subtotal,
    })),
    createdAt: o.createdAt.toISOString(),
  }))

  return successResponse(data, 200, { total: data.length })
})

/** POST — Create a new purchase order */
export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json()

  const { kitchenId, supplierId, menuId, items } = body

  if (!kitchenId || !supplierId || !items || !Array.isArray(items) || items.length === 0) {
    return errorResponse(
      'VALIDATION_ERROR',
      'kitchenId, supplierId, and items[] (array of { foodItemId, quantityKg, pricePerKg }) are required',
      400
    )
  }

  // Verify entities exist
  const [kitchen, supplier] = await Promise.all([
    prisma.sppgKitchen.findUnique({ where: { id: kitchenId } }),
    prisma.supplier.findUnique({ where: { id: supplierId } }),
  ])

  if (!kitchen) return errorResponse('NOT_FOUND', `Kitchen ${kitchenId} not found`, 404)
  if (!supplier) return errorResponse('NOT_FOUND', `Supplier ${supplierId} not found`, 404)

  // Calculate totals
  const orderItems = (items as { foodItemId: number; quantityKg: number; pricePerKg: number }[]).map(
    (item) => ({
      foodItemId: item.foodItemId,
      quantityKg: item.quantityKg,
      pricePerKg: item.pricePerKg,
      subtotal: Math.round(item.quantityKg * item.pricePerKg),
    })
  )

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const order = await prisma.purchaseOrder.create({
    data: {
      kitchenId,
      supplierId,
      menuId: menuId ?? null,
      orderDate: today,
      totalAmount,
      status: 'PENDING',
      sentVia: 'WHATSAPP',
      items: {
        create: orderItems,
      },
    },
    include: {
      supplier: { select: { name: true, phone: true } },
      items: {
        include: { foodItem: { select: { name: true } } },
      },
    },
  })

  return successResponse(
    {
      id: order.id,
      supplier: order.supplier,
      totalAmount: order.totalAmount,
      status: order.status,
      items: order.items.map((item) => ({
        foodItem: item.foodItem.name,
        quantityKg: Number(item.quantityKg),
        pricePerKg: item.pricePerKg,
        subtotal: item.subtotal,
      })),
      whatsappMessage: `📋 *Purchase Order Nutrimize*\n\nKepada: ${order.supplier.name}\nTanggal: ${today.toLocaleDateString('id-ID')}\n\n${order.items.map((i) => `• ${i.foodItem.name}: ${Number(i.quantityKg)}kg × Rp${i.pricePerKg.toLocaleString('id-ID')} = Rp${i.subtotal.toLocaleString('id-ID')}`).join('\n')}\n\n*Total: Rp${totalAmount.toLocaleString('id-ID')}*\n\nMohon konfirmasi ketersediaan. Terima kasih! 🙏`,
    },
    201
  )
})
