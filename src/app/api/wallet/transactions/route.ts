// src/app/api/wallet/transactions/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { Transaction } from '@/lib/db/models/Transaction';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';

/**
 * GET /api/wallet/transactions - Get admin's transactions
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

    // Fetch transactions for admin, sorted by most recent first
    const transactions = await Transaction.find({ adminId })
      .sort({ createdAt: -1 })
      .limit(100); // Limit to 100 most recent transactions

    return successResponse(transactions, 'Transactions fetched successfully', 200);
  } catch (error) {
    console.error('Get transactions error:', error);
    return serverErrorResponse('Failed to fetch transactions');
  }
}