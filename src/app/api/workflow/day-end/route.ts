// src/app/api/workflow/day-end/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { DayWorkflow } from '@/lib/db/models/DayWorkflow';
import { Transaction } from '@/lib/db/models/Transaction';
import { Wallet } from '@/lib/db/models/Wallet';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';

/**
 * POST /api/workflow/day-end - End the day with closing balance
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
    const { closingBalanceCash, closingBalanceUpi, notes } = body;

    // Get today's workflow
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const workflow = await DayWorkflow.findOne({
      adminId,
      date: { $gte: today, $lt: tomorrow },
    });

    if (!workflow) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error',
          error: 'No workflow found for today',
        }),
        { status: 404 }
      );
    }

    if (workflow.status !== 'in_progress') {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Error',
          error: 'Day is not in progress',
        }),
        { status: 400 }
      );
    }

    // Get all transactions for today
    const todayTransactions = await Transaction.find({
      adminId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    // Calculate totals
    let totalCashIn = 0;
    let totalUpiIn = 0;

    todayTransactions.forEach((transaction) => {
      if (transaction.type === 'credit') {
        if (transaction.method === 'cash') {
          totalCashIn += transaction.amount;
        } else if (transaction.method === 'upi') {
          totalUpiIn += transaction.amount;
        }
      }
    });

    // Update workflow
    workflow.status = 'completed';
    workflow.closingBalance = {
      cash: closingBalanceCash || 0,
      upi: closingBalanceUpi || 0,
    };
    workflow.totalTransactions = todayTransactions.length;
    workflow.totalCashIn = totalCashIn;
    workflow.totalUpiIn = totalUpiIn;
    workflow.notes = notes || '';

    await workflow.save();

    // Update wallet with closing balances
    let wallet = await Wallet.findOne({ adminId });
    if (!wallet) {
      wallet = new Wallet({
        adminId,
        cashBalance: closingBalanceCash || 0,
        upiBalance: closingBalanceUpi || 0,
        totalBalance: (closingBalanceCash || 0) + (closingBalanceUpi || 0),
      });
    } else {
      wallet.cashBalance = closingBalanceCash || 0;
      wallet.upiBalance = closingBalanceUpi || 0;
      wallet.totalBalance = (closingBalanceCash || 0) + (closingBalanceUpi || 0);
    }
    wallet.lastUpdated = new Date();
    await wallet.save();

    return successResponse(workflow, 'Day ended successfully', 200);
  } catch (error) {
    console.error('Day end error:', error);
    return serverErrorResponse('Failed to end day');
  }
}