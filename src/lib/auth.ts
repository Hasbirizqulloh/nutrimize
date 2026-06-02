/**
 * @file src/lib/auth.ts
 * @description Authentication utilities for Nutrimize.
 * 
 * - JWT token signing & verification (jsonwebtoken)
 * - Password hashing & comparison (bcryptjs)
 * - Token extraction from request headers
 */

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const JWT_SECRET = process.env.JWT_SECRET || 'nutrimize-dev-secret-key-2026'
const JWT_EXPIRES_IN = '24h'

export interface JwtPayload {
  userId: string
  role: string
  email: string
}

/**
 * Hash a plaintext password using bcrypt (10 salt rounds).
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Compare a plaintext password against a bcrypt hash.
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Sign a JWT token with user data.
 */
export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Verify and decode a JWT token. Returns null if invalid/expired.
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload
  } catch {
    return null
  }
}

/**
 * Extract the Bearer token from a request's Authorization header.
 */
export function extractToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice(7)
}

/**
 * Authenticate a request — extracts token, verifies it, and returns the payload.
 * Returns null if the request is not authenticated.
 */
export function authenticateRequest(request: Request): JwtPayload | null {
  const token = extractToken(request)
  if (!token) return null
  return verifyToken(token)
}
