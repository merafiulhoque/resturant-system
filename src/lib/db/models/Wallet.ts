// src/lib/db/models/Wallet.ts

import mongoose from 'mongoose';
import { IWallet } from '@/types';

const walletSchema = new mongoose.Schema<IWallet>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
      unique: true,
    },
    cashBalance: {
      type: Number,
      default: 0,
    },
    upiBalance: {
      type: Number,
      default: 0,
    },
    totalBalance: {
      type: Number,
      default: 0,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Wallet = mongoose.models.Wallet || mongoose.model('Wallet', walletSchema);