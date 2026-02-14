// src/lib/utils/api-response.ts

import { NextResponse } from 'next/server';
import { ApiResponse } from '@/types';

/**
 * Success Response
 */
export function successResponse<T>(
  data: T,
  message: string = 'Success',
  status: number = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Error Response
 */
export function errorResponse(
  error: string,
  message: string = 'Error',
  status: number = 400
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
    },
    { status }
  );
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse(message: string = 'Unauthorized'): NextResponse<ApiResponse> {
  return errorResponse('Unauthorized', message, 401);
}

/**
 * Forbidden Response
 */
export function forbiddenResponse(message: string = 'Forbidden'): NextResponse<ApiResponse> {
  return errorResponse('Forbidden', message, 403);
}

/**
 * Not Found Response
 */
export function notFoundResponse(message: string = 'Not Found'): NextResponse<ApiResponse> {
  return errorResponse('Not Found', message, 404);
}

/**
 * Server Error Response
 */
export function serverErrorResponse(message: string = 'Internal Server Error'): NextResponse<ApiResponse> {
  return errorResponse('Server Error', message, 500);
}