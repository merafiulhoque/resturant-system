// src/lib/utils/validators.ts

import { z } from 'zod';
import { VALIDATION_MESSAGES } from '@/constants';

/**
 * Login Validation Schema
 */
export const loginSchema = z.object({
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
  role: z.enum(['admin', 'staff']),
});

/**
 * Register User Validation Schema
 */
export const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
    password: z.string().min(6, VALIDATION_MESSAGES.PASSWORD_MIN_LENGTH),
    confirmPassword: z.string(),
    phone: z.string().min(7, VALIDATION_MESSAGES.INVALID_PHONE),
    isoCode: z.string().default('+91'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
    path: ['confirmPassword'],
  });

/**
 * Staff Creation Validation Schema
 */
export const createStaffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email(VALIDATION_MESSAGES.INVALID_EMAIL),
  phone: z.string().min(7, VALIDATION_MESSAGES.INVALID_PHONE),
  isoCode: z.string().default('+91'),
  position: z.string().min(2, 'Position must be at least 2 characters'),
  salary: z.number().positive('Salary must be positive').optional(),
});

/**
 * Update Staff Validation Schema
 */
export const updateStaffSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().min(7, VALIDATION_MESSAGES.INVALID_PHONE).optional(),
  position: z.string().min(2, 'Position must be at least 2 characters').optional(),
  salary: z.number().positive('Salary must be positive').optional(),
  isActive: z.boolean().optional(),
});

/**
 * Menu Item Creation Validation Schema
 */
export const createMenuItemSchema = z.object({
  name: z.string().min(2, 'Menu item name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive(VALIDATION_MESSAGES.INVALID_AMOUNT),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  image: z.string().url('Image must be a valid URL').optional(),
});

/**
 * Update Menu Item Validation Schema
 */
export const updateMenuItemSchema = z.object({
  name: z.string().min(2, 'Menu item name must be at least 2 characters').optional(),
  description: z.string().optional(),
  price: z.number().positive(VALIDATION_MESSAGES.INVALID_AMOUNT).optional(),
  category: z.string().min(2, 'Category must be at least 2 characters').optional(),
  image: z.string().url('Image must be a valid URL').optional(),
  isAvailable: z.boolean().optional(),
});

/**
 * Order Item Validation Schema
 */
export const orderItemSchema = z.object({
  menuItemId: z.string(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

/**
 * Create Order Validation Schema
 */
export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
});

/**
 * Bill Creation Validation Schema
 */
export const createBillSchema = z.object({
  orderId: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  discountPercentage: z
    .number()
    .min(0)
    .max(100, VALIDATION_MESSAGES.INVALID_DISCOUNT)
    .default(0),
  paymentMethod: z.enum(['cash', 'upi', 'card']).default('cash'),
});

/**
 * Day Workflow Validation Schema
 */
export const dayWorkflowSchema = z.object({
  openingBalanceCash: z.number().min(0, 'Opening balance must be positive').default(0),
  openingBalanceUpi: z.number().min(0, 'Opening balance must be positive').default(0),
});

/**
 * Cash Transfer Validation Schema
 */
export const cashTransferSchema = z
  .object({
    amount: z.number().positive(VALIDATION_MESSAGES.INVALID_AMOUNT),
    from: z.enum(['cash', 'upi']),
    to: z.enum(['cash', 'upi']),
    notes: z.string().optional(),
  })
  .refine((data) => data.from !== data.to, {
    message: 'From and To must be different',
  });

/**
 * Validate data against schema
 */
export function validateData<T>(
  schema: z.ZodSchema,
  data: unknown
): { success: boolean; data?: T; error?: z.ZodError } {
  try {
    const validatedData = schema.parse(data) as T;
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error };
    }
    throw error;
  }
}