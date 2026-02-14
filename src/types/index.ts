// src/types/index.ts

/**
 * User Roles
 */
export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
}

/**
 * JWT Payload
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

/**
 * API Response Format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/**
 * User Document
 */
export interface IUser {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone: string;
  isoCode: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Staff Document
 */
export interface IStaff {
  _id?: string;
  adminId: string;
  name: string;
  email: string;
  phone: string;
  isoCode: string;
  position: string;
  salary?: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Menu Item Document
 */
export interface IMenuItem {
  _id?: string;
  adminId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  isAvailable: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Order Item
 */
export interface IOrderItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

/**
 * Order Document
 */
export interface IOrder {
  _id?: string;
  adminId: string;
  staffId: string;
  items: IOrderItem[];
  totalAmount: number;
  orderStatus: 'pending' | 'completed' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Bill Document
 */
export interface IBill {
  _id?: string;
  adminId: string;
  staffId: string;
  orderId: string;
  items: IOrderItem[];
  subtotal: number;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: 'cash' | 'upi' | 'card';
  billStatus: 'draft' | 'finalized' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Wallet Transaction Document
 */
export interface ITransaction {
  _id?: string;
  adminId: string;
  type: 'credit' | 'debit';
  method: 'cash' | 'upi' | 'card';
  amount: number;
  description: string;
  billId?: string;
  createdAt?: Date;
}

/**
 * Wallet Document
 */
export interface IWallet {
  _id?: string;
  adminId: string;
  cashBalance: number;
  upiBalance: number;
  totalBalance: number;
  lastUpdated?: Date;
}

/**
 * Day Workflow Document
 */
export interface IDayWorkflow {
  _id?: string;
  adminId: string;
  date: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  openingBalance: {
    cash: number;
    upi: number;
  };
  closingBalance: {
    cash: number;
    upi: number;
  };
  totalTransactions: number;
  totalCashIn: number;
  totalUpiIn: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Login Request
 */
export interface LoginRequest {
  email: string;
  password: string;
  role: UserRole;
}

/**
 * Login Response
 */
export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    phone: string;
    isoCode: string;
  };
}