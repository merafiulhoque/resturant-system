// src/lib/db/models/Transaction.ts

import mongoose from 'mongoose';
import { ITransaction } from '@/types';

const transactionSchema = new mongoose.Schema<ITransaction>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    type: {
      type: String,
      enum: ['credit', 'debit'],
      required: [true, 'Transaction type is required'],
    },
    method: {
      type: String,
      enum: ['cash', 'upi', 'card'],
      default: 'cash',
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    description: {
      type: String,
      trim: true,
    },
    billId: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);