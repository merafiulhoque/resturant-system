// src/app/api/auth/logout/route.ts

import { NextRequest } from 'next/server';
import { successResponse } from '@/lib/utils/api-response';
import { SUCCESS_MESSAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    return successResponse(
      {},
      SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      200
    );
  } catch (error) {
    console.error('Logout error:', error);
    return successResponse(
      {},
      SUCCESS_MESSAGES.LOGOUT_SUCCESS,
      200
    );
  }
}