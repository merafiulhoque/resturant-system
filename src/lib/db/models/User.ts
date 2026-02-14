// src/lib/db/models/User.ts

import mongoose from 'mongoose';
import { IUser, UserRole } from '@/types';

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.STAFF,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);