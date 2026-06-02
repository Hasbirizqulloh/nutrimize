/**
 * @file src/app/api/auth/me/route.ts
 * @description Auth Me API — get current user info from JWT token.
 *
 * GET /api/auth/me
 *   Headers: Authorization: Bearer <jwt_token>
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'
import { authenticateRequest } from '@/lib/auth'

export const GET = withErrorHandler(async (request: Request) => {
  const payload = authenticateRequest(request)

  if (!payload) {
    return errorResponse('UNAUTHORIZED', 'Invalid or expired token', 401)
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    include: {
      kitchens: {
        select: { id: true, name: true, regionId: true, status: true },
      },
      supplier: {
        select: { id: true, name: true, type: true, isVerified: true },
      },
    },
  })

  if (!user || !user.isActive) {
    return errorResponse('UNAUTHORIZED', 'User not found or deactivated', 401)
  }

  return successResponse({
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    phone: user.phone,
    avatarUrl: user.avatarUrl,
    kitchen: user.kitchens[0] ?? null,
    supplier: user.supplier ?? null,
  })
})
