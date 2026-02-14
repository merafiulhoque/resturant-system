// src/lib/db/models/MenuItem.ts

import mongoose from 'mongoose';
import { IMenuItem } from '@/types';

const menuItemSchema = new mongoose.Schema<IMenuItem>(
  {
    adminId: {
      type: String,
      required: [true, 'Admin ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Menu item name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);