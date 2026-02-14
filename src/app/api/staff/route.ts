// src/app/api/staff/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { Staff } from '@/lib/db/models/Staff';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';
import { validateData, createStaffSchema } from '@/lib/utils/validators';
import { hashPassword } from '@/lib/utils/auth';
import { UserRole } from '@/types';

/**
 * GET /api/staff - Get all staff members for admin
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const adminId = auth.payload?.userId;

    // Fetch all staff for this admin
    const staffList = await Staff.find({ adminId });

    return successResponse(staffList, 'Staff fetched successfully', 200);
  } catch (error) {
    console.error('Get staff error:', error);
    return serverErrorResponse('Failed to fetch staff');
  }
}

/**
 * POST /api/staff - Create new staff member
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const adminId = auth.payload?.userId;
    const body = await request.json();

    // Validate input
    const validation = validateData(createStaffSchema, body);
    if (!validation.success) {
      const firstIssue = validation.error?.issues[0];
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation Error',
          error: firstIssue?.message || 'Validation failed',
        }),
        { status: 400 }
      );
    }

    // Create new staff
    const staffData = validation.data as { name: string; email: string; phone: string; isoCode: string; position: string; salary?: number };
    const password = body.password;

    if (!password) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation Error',
          error: 'Password is required',
        }),
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: staffData.email });
    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Validation Error',
          error: 'Email already exists',
        }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user account for staff
    const newUser = new User({
      name: staffData.name,
      email: staffData.email,
      password: hashedPassword,
      role: UserRole.STAFF,
      phone: staffData.phone,
      isoCode: staffData.isoCode,
      isActive: true,
    });

    await newUser.save();

    // Create staff record
    const newStaff = new Staff({
      adminId,
      name: staffData.name,
      email: staffData.email,
      phone: staffData.phone,
      isoCode: staffData.isoCode,
      position: staffData.position,
      salary: staffData.salary || 0,
      isActive: true,
    });

    await newStaff.save();

    return successResponse(newStaff, 'Staff member added successfully', 201);
  } catch (error) {
    console.error('Create staff error:', error);
    return serverErrorResponse('Failed to create staff');
  }
}
