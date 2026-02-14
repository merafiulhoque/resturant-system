// src/lib/utils/auth.ts

import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import { JwtPayload, UserRole } from '@/types';
import { JWT_CONFIG } from '@/constants';
import { NextRequest } from 'next/server';

/**
 * Hash password using bcryptjs
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = await bcryptjs.genSalt(10);
    return await bcryptjs.hash(password, salt);
  } catch (error) {
    console.error('Error hashing password:', error);
    throw error;
  }
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  try {
    return await bcryptjs.compare(password, hash);
  } catch (error) {
    console.error('Error comparing password:', error);
    throw error;
  }
}

/**
 * Generate JWT token
 */
export function generateToken(payload: Omit<JwtPayload, 'iat' | 'exp'>): string {
  try {
    return jwt.sign(payload, JWT_CONFIG.SECRET, {
      expiresIn: JWT_CONFIG.EXPIRY,
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_CONFIG.SECRET) as JwtPayload;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

/**
 * Extract token from Authorization header
 */
export function extractTokenFromHeader(request: NextRequest): string | null {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  } catch (error) {
    console.error('Error extracting token:', error);
    return null;
  }
}

/**
 * Authenticate request and verify admin role
 * REUSABLE function for all admin routes
 */
export function authenticateAdminRequest(request: NextRequest): {
  isValid: boolean;
  payload: JwtPayload | null;
  error?: string;
} {
  const token = extractTokenFromHeader(request);

  if (!token) {
    return {
      isValid: false,
      payload: null,
      error: 'No token provided',
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      isValid: false,
      payload: null,
      error: 'Invalid or expired token',
    };
  }

  if (payload.role !== UserRole.ADMIN) {
    return {
      isValid: false,
      payload: null,
      error: 'Unauthorized: Admin access required',
    };
  }

  return {
    isValid: true,
    payload,
  };
}

/**
 * Authenticate request and verify staff role
 * REUSABLE function for all staff routes
 */
export function authenticateStaffRequest(request: NextRequest): {
  isValid: boolean;
  payload: JwtPayload | null;
  error?: string;
} {
  const token = extractTokenFromHeader(request);

  if (!token) {
    return {
      isValid: false,
      payload: null,
      error: 'No token provided',
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      isValid: false,
      payload: null,
      error: 'Invalid or expired token',
    };
  }

  if (payload.role !== UserRole.STAFF) {
    return {
      isValid: false,
      payload: null,
      error: 'Unauthorized: Staff access required',
    };
  }

  return {
    isValid: true,
    payload,
  };
}

/**
 * Generic authentication for any request
 */
export function authenticateRequest(request: NextRequest): {
  isValid: boolean;
  payload: JwtPayload | null;
  error?: string;
} {
  const token = extractTokenFromHeader(request);

  if (!token) {
    return {
      isValid: false,
      payload: null,
      error: 'No token provided',
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      isValid: false,
      payload: null,
      error: 'Invalid or expired token',
    };
  }

  return {
    isValid: true,
    payload,
  };
}