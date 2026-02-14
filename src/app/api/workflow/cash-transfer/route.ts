// src/app/api/workflow/cash-transfer/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { Transaction } from '@/lib/db/models/Transaction';
import { Wallet } from '@/lib/db/models/Wallet';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';
import { validateData, cashTransferSchema } from '@/lib/utils/validators';

/**
 * POST /api/workflow/cash-transfer - Transfer cash between accounts
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
    const validation = validateData(cashTransferSchema, body);
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

    const transferData = validation.data as {
      amount: number;
      from: 'cash' | 'upi';
      to: 'cash' | 'upi';
      notes?: string;
    };

    // Get or create wallet
    let wallet = await Wallet.findOne({ adminId });
    if (!wallet) {
      wallet = new Wallet({
        adminId,
        cashBalance: 0,
        upiBalance: 0,
        totalBalance: 0,
      });
    }

    // Check if from balance is sufficient
    const fromBalance = transferData.from === 'cash' ? wallet.cashBalance : wallet.upiBalance;
    if (fromBalance < transferData.amount) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Insufficient Balance',
          error: `Insufficient ${transferData.from} balance`,
        }),
        { status: 400 }
      );
    }

    // Update wallet balances
    if (transferData.from === 'cash') {
      wallet.cashBalance -= transferData.amount;
      wallet.upiBalance += transferData.amount;
    } else {
      wallet.upiBalance -= transferData.amount;
      wallet.cashBalance += transferData.amount;
    }

    wallet.totalBalance = wallet.cashBalance + wallet.upiBalance;
    wallet.lastUpdated = new Date();
    await wallet.save();

    // Create transaction records (debit from 'from', credit to 'to')
    const debitTransaction = new Transaction({
      adminId,
      type: 'debit',
      method: transferData.from,
      amount: transferData.amount,
      description: `Transfer to ${transferData.to} ${transferData.notes ? '- ' + transferData.notes : ''}`,
    });

    const creditTransaction = new Transaction({
      adminId,
      type: 'credit',
      method: transferData.to,
      amount: transferData.amount,
      description: `Transfer from ${transferData.from} ${transferData.notes ? '- ' + transferData.notes : ''}`,
    });

    await debitTransaction.save();
    await creditTransaction.save();

    return successResponse(
      { wallet, transactions: [debitTransaction, creditTransaction] },
      'Cash transferred successfully',
      200
    );
  } catch (error) {
    console.error('Cash transfer error:', error);
    return serverErrorResponse('Failed to transfer cash');
  }
}