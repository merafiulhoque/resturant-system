// src/lib/db/models/DayWorkflow.ts

import mongoose from 'mongoose';
import { IDayWorkflow } from '@/types';

const dayWorkflowSchema = new mongoose.Schema<IDayWorkflow>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    openingBalance: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
    },
    closingBalance: {
      cash: { type: Number, default: 0 },
      upi: { type: Number, default: 0 },
    },
    totalTransactions: {
      type: Number,
      default: 0,
    },
    totalCashIn: {
      type: Number,
      default: 0,
    },
    totalUpiIn: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const DayWorkflow = mongoose.models.DayWorkflow || mongoose.model('DayWorkflow', dayWorkflowSchema);