/**
 * @file src/app/api/kitchens/[id]/route.ts
 * @description Kitchen detail & update API.
 *
 * GET   /api/kitchens/[id]  — Get kitchen detail
 * PATCH /api/kitchens/[id]  — Update kitchen settings
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'

/** GET — Kitchen detail with stats */
export const GET = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params

  const kitchen = await prisma.sppgKitchen.findUnique({
    where: { id },
    include: {
      region: true,
      user: { select: { fullName: true, email: true, phone: true } },
      _count: {
        select: { dailyMenus: true, purchaseOrders: true },
      },
    },
  })

  if (!kitchen) {
    return errorResponse('NOT_FOUND', `Kitchen ${id} not found`, 404)
  }

  return successResponse({
    id: kitchen.id,
    name: kitchen.name,
    manager: {
      fullName: kitchen.user.fullName,
      email: kitchen.user.email,
      phone: kitchen.user.phone,
    },
    region: {
      id: kitchen.region.id,
      province: kitchen.region.province,
      city: kitchen.region.city,
      district: kitchen.region.district,
    },
    address: kitchen.address,
    coordinates: kitchen.lat && kitchen.lng
      ? { lat: Number(kitchen.lat), lng: Number(kitchen.lng) }
      : null,
    dailyBudget: kitchen.dailyBudget,
    dailyPortions: kitchen.dailyPortions,
    status: kitchen.status,
    stats: {
      totalMenus: kitchen._count.dailyMenus,
      totalOrders: kitchen._count.purchaseOrders,
    },
    createdAt: kitchen.createdAt.toISOString(),
    updatedAt: kitchen.updatedAt.toISOString(),
  })
})

/** PATCH — Update kitchen settings (budget, portions, status, etc.) */
export const PATCH = withErrorHandler(async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  const body = await request.json()

  // Validate kitchen exists
  const existing = await prisma.sppgKitchen.findUnique({ where: { id } })
  if (!existing) {
    return errorResponse('NOT_FOUND', `Kitchen ${id} not found`, 404)
  }

  // Only allow specific fields to be updated
  const allowedFields = ['name', 'address', 'lat', 'lng', 'dailyBudget', 'dailyPortions', 'status']
  const updateData: Record<string, unknown> = {}
  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      updateData[field] = body[field]
    }
  }

  if (Object.keys(updateData).length === 0) {
    return errorResponse('VALIDATION_ERROR', 'No valid fields to update', 400)
  }

  const updated = await prisma.sppgKitchen.update({
    where: { id },
    data: updateData,
  })

  return successResponse({
    id: updated.id,
    name: updated.name,
    dailyBudget: updated.dailyBudget,
    dailyPortions: updated.dailyPortions,
    status: updated.status,
    updatedAt: updated.updatedAt.toISOString(),
  })
})
