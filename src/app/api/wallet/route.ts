// src/app/api/wallet/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { Wallet } from '@/lib/db/models/Wallet';
import { authenticateAdminRequest } from '@/lib/utils/auth';
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@/lib/utils/api-response';

/**
 * GET /api/wallet - Get admin's wallet
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

    // Find or create wallet
    let wallet = await Wallet.findOne({ adminId });

    if (!wallet) {
      // Create wallet if it doesn't exist
      wallet = new Wallet({
        adminId,
        cashBalance: 0,
        upiBalance: 0,
        totalBalance: 0,
        lastUpdated: new Date(),
      });
      await wallet.save();
    }

    return successResponse(wallet, 'Wallet fetched successfully', 200);
  } catch (error) {
    console.error('Get wallet error:', error);
    return serverErrorResponse('Failed to fetch wallet');
  }
}