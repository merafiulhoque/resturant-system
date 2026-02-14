// src/app/api/staff/[id]/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { Staff } from '@/lib/db/models/Staff';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';
import { validateData, updateStaffSchema } from '@/lib/utils/validators';

/**
 * PUT /api/staff/:id - Update staff member
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const { id: staffId } = await params;

    if (!staffId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid Request',
          error: 'Staff ID not provided',
        }),
        { status: 400 }
      );
    }

    const body = await request.json();

    // Validate input
    const validation = validateData(updateStaffSchema, body);
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

    const staffData = validation.data as {
      name?: string;
      phone?: string;
      position?: string;
      salary?: number;
      isActive?: boolean;
    };

    // Update staff
    const updatedStaff = await Staff.findByIdAndUpdate(staffId, staffData, { new: true });

    if (!updatedStaff) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Not Found',
          error: 'Staff member not found',
        }),
        { status: 404 }
      );
    }

    return successResponse(updatedStaff, 'Staff member updated successfully', 200);
  } catch (error) {
    console.error('Update staff error:', error);
    return serverErrorResponse('Failed to update staff');
  }
}

/**
 * DELETE /api/staff/:id - Delete staff member
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await dbConnect();

    // Authenticate admin
    const auth = authenticateAdminRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(auth.error);
    }

    const { id: staffId } = await params;

    if (!staffId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid Request',
          error: 'Staff ID not provided',
        }),
        { status: 400 }
      );
    }

    // Delete staff
    const deletedStaff = await Staff.findByIdAndDelete(staffId);

    if (!deletedStaff) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Not Found',
          error: 'Staff member not found',
        }),
        { status: 404 }
      );
    }

    return successResponse({}, 'Staff member deleted successfully', 200);
  } catch (error) {
    console.error('Delete staff error:', error);
    return serverErrorResponse('Failed to delete staff');
  }
}