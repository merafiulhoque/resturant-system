// src/app/api/workflow/day-begin/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { DayWorkflow } from '@/lib/db/models/DayWorkflow';
import { Wallet } from '@/lib/db/models/Wallet';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';

/**
 * POST /api/workflow/day-begin - Begin the day with opening balance
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
    const { openingBalanceCash, openingBalanceUpi } = body;

    // Check if today's workflow already exists
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingWorkflow = await DayWorkflow.findOne({
      adminId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingWorkflow && existingWorkflow.status !== 'not_started') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error',
          error: 'Day already started',
        }),
        { status: 400 }
      );
    }

    // Create or update workflow
    let workflow;
    if (existingWorkflow) {
      workflow = await DayWorkflow.findByIdAndUpdate(
        existingWorkflow._id,
        {
          status: 'in_progress',
          openingBalance: {
            cash: openingBalanceCash || 0,
            upi: openingBalanceUpi || 0,
          },
        },
        { new: true }
      );
    } else {
      workflow = new DayWorkflow({
        adminId,
        date: today,
        status: 'in_progress',
        openingBalance: {
          cash: openingBalanceCash || 0,
          upi: openingBalanceUpi || 0,
        },
        closingBalance: {
          cash: 0,
          upi: 0,
        },
      });
      await workflow.save();
    }

    return successResponse(workflow, 'Day started successfully', 200);
  } catch (error) {
    console.error('Day begin error:', error);
    return serverErrorResponse('Failed to start day');
  }
}