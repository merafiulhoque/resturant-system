// src/app/api/workflow/today/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { DayWorkflow } from '@/lib/db/models/DayWorkflow';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';

/**
 * GET /api/workflow/today - Get today's workflow
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

    // Get today's workflow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let workflow = await DayWorkflow.findOne({
      adminId,
      date: { $gte: today, $lt: tomorrow },
    });

    // If no workflow exists, create one with 'not_started' status
    if (!workflow) {
      workflow = new DayWorkflow({
        adminId,
        date: today,
        status: 'not_started',
        openingBalance: { cash: 0, upi: 0 },
        closingBalance: { cash: 0, upi: 0 },
        totalTransactions: 0,
        totalCashIn: 0,
        totalUpiIn: 0,
      });
      await workflow.save();
    }

    return successResponse(workflow, 'Today\'s workflow fetched successfully', 200);
  } catch (error) {
    console.error('Get today workflow error:', error);
    return serverErrorResponse('Failed to fetch today\'s workflow');
  }
}