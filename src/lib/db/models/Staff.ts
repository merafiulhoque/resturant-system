// src/lib/db/models/Staff.ts

import mongoose from 'mongoose';
import { IStaff } from '@/types';

const staffSchema = new mongoose.Schema<IStaff>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    isoCode: {
      type: String,
      default: '+91',
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
    },
    salary: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.models.Staff || mongoose.model('Staff', staffSchema);