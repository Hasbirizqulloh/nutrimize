/**
 * @file src/app/api/purchase-orders/[id]/route.ts
 * @description Purchase Order status update API.
 *
 * PATCH /api/purchase-orders/[id]  — Update PO status
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** PATCH — Update purchase order status */
export const PATCH = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()

  const existing = await prisma.purchaseOrder.findUnique({ where: { id } })
  if (!existing) {
    return errorResponse('NOT_FOUND', `Purchase order ${id} not found`, 404)
  }

  // Valid status transitions
  const validTransitions: Record<string, string[]> = {
    PENDING: ['SENT', 'CANCELLED'],
    SENT: ['CONFIRMED', 'CANCELLED'],
    CONFIRMED: ['DELIVERED', 'CANCELLED'],
    DELIVERED: [],
    CANCELLED: [],
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

  const updated = await prisma.purchaseOrder.update({
    where: { id },
    data: {
      status: body.status ?? existing.status,
    },
  })

  return successResponse({
    id: updated.id,
    status: updated.status,
    updatedAt: updated.updatedAt.toISOString(),
  })
})
