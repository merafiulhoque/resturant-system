// src/app/api/menu/[id]/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { MenuItem } from '@/lib/db/models/MenuItem';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';
import { validateData, updateMenuItemSchema } from '@/lib/utils/validators';

/**
 * PUT /api/menu/:id - Update menu item
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const { id: menuItemId } = await params;

    if (!menuItemId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid Request',
          error: 'Menu item ID not provided',
        }),
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(updateMenuItemSchema, body);
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
      name?: string;
      description?: string;
      price?: number;
      category?: string;
      image?: string;
      isAvailable?: boolean;
    };

    // Update menu item
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(menuItemId, menuData, { new: true });

    if (!updatedMenuItem) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Not Found',
          error: 'Menu item not found',
        }),
        { status: 404 }
      );
    }

    return successResponse(updatedMenuItem, 'Menu item updated successfully', 200);
  } catch (error) {
    console.error('Update menu item error:', error);
    return serverErrorResponse('Failed to update menu item');
  }
}

/**
 * DELETE /api/menu/:id - Delete menu item
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const { id: menuItemId } = await params;

    if (!menuItemId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid Request',
          error: 'Menu item ID not provided',
        }),
        { status: 400 }
      );
    }

    // Delete menu item
    const deletedMenuItem = await MenuItem.findByIdAndDelete(menuItemId);

    if (!deletedMenuItem) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Not Found',
          error: 'Menu item not found',
        }),
        { status: 404 }
      );
    }

    return successResponse({}, 'Menu item deleted successfully', 200);
  } catch (error) {
    console.error('Delete menu item error:', error);
    return serverErrorResponse('Failed to delete menu item');
  }
}