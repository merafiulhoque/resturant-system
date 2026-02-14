// src/app/api/auth/create-admin/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { User } from '@/lib/db/models/User';
import { hashPassword } from '@/lib/utils/auth';
import { successResponse, errorResponse } from '@/lib/utils/api-response';
import { UserRole } from '@/types';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return errorResponse('Missing required fields', 'Validation Error', 400);
    }

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: UserRole.ADMIN });
    if (existingAdmin) {
      return errorResponse('Admin already exists', 'Admin exists', 400);
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('Email already exists', 'Duplicate Email', 400);
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create admin user
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
      phone: '+919999999999',
      isoCode: '+91',
      isActive: true,
    });

    await newAdmin.save();

    return successResponse(
      {
        _id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role,
      },
      'Admin user created successfully',
      201
    );
  } catch (error) {
    console.error('Create admin error:', error);
    return errorResponse('Internal server error', 'Server Error', 500);
  }
}