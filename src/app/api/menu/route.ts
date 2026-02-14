// src/app/api/menu/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { MenuItem } from '@/lib/db/models/MenuItem';
import { Staff } from '@/lib/db/models/Staff';
import { authenticateRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';
import { validateData, createMenuItemSchema } from '@/lib/utils/validators';
import { UserRole } from '@/types';

/**
 * GET /api/menu - Get all menu items (for both admin and staff)
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate any user (admin or staff)
    const auth = authenticateRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const userId = auth.payload?.userId;
    const userRole = auth.payload?.role;

    let adminId = userId;

    // If staff, find which admin they belong to
    if (userRole === UserRole.STAFF) {
      const staffMember = await Staff.findOne({ 'email': auth.payload?.email });
      if (!staffMember) {
        return unauthorizedResponse('Staff member not found');
      }
      adminId = staffMember.adminId;
    }

    // Fetch all menu items for this admin
    const menuItems = await MenuItem.find({ adminId });

    return successResponse(menuItems, 'Menu items fetched successfully', 200);
  } catch (error) {
    console.error('Get menu items error:', error);
    return serverErrorResponse('Failed to fetch menu items');
  }
}

/**
 * POST /api/menu - Create new menu item
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const adminId = auth.payload?.userId;
    const body = await request.json();

    // Validate input
    const validation = validateData(createMenuItemSchema, body);
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

    const menuData = validation.data as {
      name: string;
      description?: string;
      price: number;
      category: string;
      image?: string;
    };

    // Create new menu item
    const newMenuItem = new MenuItem({
      adminId,
      name: menuData.name,
      description: menuData.description || '',
      price: menuData.price,
      category: menuData.category,
      image: menuData.image || '',
      isAvailable: true,
    });

    await newMenuItem.save();

    return successResponse(newMenuItem, 'Menu item added successfully', 201);
  } catch (error) {
    console.error('Create menu item error:', error);
    return serverErrorResponse('Failed to create menu item');
  }
}