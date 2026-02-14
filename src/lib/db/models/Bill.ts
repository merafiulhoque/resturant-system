// src/lib/db/models/Bill.ts

import mongoose from 'mongoose';
import { IBill } from '@/types';

const billSchema = new mongoose.Schema<IBill>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    staffId: {
      type: String,
      required: [true, 'Staff ID is required'],
    },
    orderId: {
      type: String,
    },
    items: [
      {
        menuItemId: String,
        name: String,
        price: Number,
        quantity: Number,
        subtotal: Number,
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
    discountPercentage: {
      type: Number,
      default: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'upi', 'card'],
      default: 'cash',
    },
    billStatus: {
      type: String,
      enum: ['draft', 'finalized', 'cancelled'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export const Bill = mongoose.models.Bill || mongoose.model('Bill', billSchema);