/**
 * @file src/app/api/auth/login/route.ts
 * @description Auth Login API — Production-ready with bcrypt + JWT.
 *
 * POST /api/auth/login
 *   Body: { email, password }
 *   Returns: { token, user }
 */

import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse, withErrorHandler } from '@/lib/api-response'
import { comparePassword, signToken } from '@/lib/auth'

export const POST = withErrorHandler(async (request: Request) => {
  const body = await request.json()
  const { email, password } = body

  if (!email || !password) {
    return errorResponse('VALIDATION_ERROR', 'Email and password are required', 400)
  }

  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      kitchens: { select: { id: true, name: true } },
      supplier: { select: { id: true, name: true } },
    },
  })

  if (!user) {
    return errorResponse('UNAUTHORIZED', 'Invalid email or password', 401)
  }

  // Verify password with bcrypt
  const isValid = await comparePassword(password, user.passwordHash)
  if (!isValid) {
    return errorResponse('UNAUTHORIZED', 'Invalid email or password', 401)
  }

  if (!user.isActive) {
    return errorResponse('FORBIDDEN', 'Account is deactivated', 403)
  }

  // Generate JWT token
  const token = signToken({
    userId: user.id,
    role: user.role,
    email: user.email,
  })

  return successResponse({
    token,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phone: user.phone,
      avatarUrl: user.avatarUrl,
      kitchen: user.kitchens[0] ?? null,
      supplier: user.supplier ?? null,
    },
  })
})
