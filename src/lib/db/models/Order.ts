// src/lib/db/models/Order.ts

import mongoose from 'mongoose';
import { IOrder } from '@/types';

const orderSchema = new mongoose.Schema<IOrder>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    staffId: {
      type: String,
      required: [true, 'Staff ID is required'],
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
    totalAmount: {
      type: Number,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);