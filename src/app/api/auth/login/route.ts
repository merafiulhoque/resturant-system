// src/app/api/auth/login/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { comparePassword, generateToken } from '@/lib/utils/auth';
import { validateData, loginSchema } from '@/lib/utils/validators';
import { successResponse, errorResponse, unauthorizedResponse } from '@/lib/utils/api-response';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/constants';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate input
    const validation = validateData(loginSchema, body);

    if (!validation.success) {
      const firstIssue = validation.error?.issues[0];
      return errorResponse(firstIssue?.message || 'Validation failed', 'Validation Error', 400);
    }

    const { email, password, role } = validation.data as { email: string; password: string; role: 'admin' | 'staff' };

    // Find user by email and role
    const user = await User.findOne({ email, role }).select('+password');

    if (!user) {
      return unauthorizedResponse(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Compare passwords
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      return unauthorizedResponse(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user is active
    if (!user.isActive) {
      return unauthorizedResponse('User account is inactive');
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return success response
    return successResponse(
      {
        token,
        user: {
          _id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          isoCode: user.isoCode,
        },
      },
      SUCCESS_MESSAGES.LOGIN_SUCCESS,
      200
    );
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Internal server error', ERROR_MESSAGES.SERVER_ERROR, 500);
  }
}