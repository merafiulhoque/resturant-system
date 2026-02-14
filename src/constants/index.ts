// src/constants/index.ts

/**
 * Application Metadata
 */
export const APP_CONFIG = {
  APP_NAME: 'YUMMY RESTAURANT',
  APP_TAGLINE: 'Restaurant Management System',
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
  DEFAULT_ISO_CODE: '+91',
  TIMEZONE: 'Asia/Kolkata',
} as const;

/**
 * JWT Configuration
 */
export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  EXPIRY: '7d',
  ALGORITHM: 'HS256',
} as const;

/**
 * Database Configuration
 */
export const DB_CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/yummy_restaurant',
  DB_NAME: 'yummy_restaurant',
} as const;

/**
 * Cloudinary Configuration
 */
export const CLOUDINARY_CONFIG = {
  CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  API_KEY: process.env.CLOUDINARY_API_KEY || '',
  API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  FOLDER: 'yummy_restaurant/menu_items',
} as const;

/**
 * API Routes
 */
export const API_ROUTES = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  VERIFY_TOKEN: '/api/auth/verify',
  STAFF_LIST: '/api/staff',
  STAFF_CREATE: '/api/staff',
  STAFF_UPDATE: '/api/staff/:id',
  STAFF_DELETE: '/api/staff/:id',
  MENU_LIST: '/api/menu',
  MENU_CREATE: '/api/menu',
  MENU_UPDATE: '/api/menu/:id',
  MENU_DELETE: '/api/menu/:id',
  WALLET_GET: '/api/wallet',
  WALLET_TRANSACTIONS: '/api/wallet/transactions',
  ORDER_CREATE: '/api/orders',
  ORDER_LIST: '/api/orders',
  BILL_CREATE: '/api/bills',
  BILL_LIST: '/api/bills',
  DAY_BEGIN: '/api/workflow/day-begin',
  DAY_END: '/api/workflow/day-end',
  CASH_TRANSFER: '/api/workflow/cash-transfer',
  WORKFLOW_REPORT: '/api/workflow/report',
} as const;

/**
 * Frontend Routes
 */
export const FRONTEND_ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_STAFF: '/admin/staff',
  ADMIN_MENU: '/admin/menu',
  ADMIN_WALLET: '/admin/wallet',
  ADMIN_WORKFLOW: '/admin/workflow',
  ADMIN_UPDATE_BILL: '/admin/update-bill',
  ADMIN_STAFF_PAY: '/admin/staff-pay',
  ADMIN_ANALYTICS: '/admin/analytics',
  STAFF_DASHBOARD: '/staff/dashboard',
  STAFF_MENUS: '/staff/menus',
  STAFF_TAKE_ORDER: '/staff/take-order',
  STAFF_PREPARE_BILL: '/staff/prepare-bill',
  STAFF_TODAY_ORDERS: '/staff/today-orders',
  STAFF_TODAY_BILLS: '/staff/today-bills',
  STAFF_TODAY_REPORT: '/staff/today-report',
  STAFF_WALLET: '/staff/wallet',
} as const;

/**
 * Validation Messages
 */
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_AMOUNT: 'Amount must be a positive number',
  INVALID_DISCOUNT: 'Discount must be between 0 and 100',
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'You do not have permission to access this resource',
  NOT_FOUND: 'Resource not found',
  INVALID_CREDENTIALS: 'Invalid email or password',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  TOKEN_INVALID: 'Invalid token',
  SERVER_ERROR: 'Something went wrong. Please try again',
  DUPLICATE_EMAIL: 'Email already exists',
  INVALID_REQUEST: 'Invalid request',
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  STAFF_CREATED: 'Staff member added successfully',
  STAFF_UPDATED: 'Staff member updated successfully',
  STAFF_DELETED: 'Staff member deleted successfully',
  MENU_CREATED: 'Menu item added successfully',
  MENU_UPDATED: 'Menu item updated successfully',
  MENU_DELETED: 'Menu item deleted successfully',
  ORDER_CREATED: 'Order created successfully',
  BILL_CREATED: 'Bill created successfully',
  DAY_BEGUN: 'Day started successfully',
  DAY_ENDED: 'Day ended successfully',
} as const;

/**
 * Pagination
 */
export const PAGINATION = {
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE: 1,
  MAX_LIMIT: 100,
} as const;

/**
 * ISO Country Codes
 */
export const ISO_COUNTRY_CODES = [
  { code: '+1', country: 'USA/Canada', flag: '🇺🇸' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
] as const;

/**
 * Menu Categories
 */
export const MENU_CATEGORIES = [
  'Appetizers',
  'Soups',
  'Salads',
  'Main Course',
  'Breads',
  'Rice & Biryani',
  'Desserts',
  'Beverages',
  'Specials',
] as const;

/**
 * Payment Methods
 */
export const PAYMENT_METHODS = ['cash', 'upi', 'card'] as const;

/**
 * Order Status
 */
export const ORDER_STATUS = ['pending', 'completed', 'cancelled'] as const;

/**
 * Bill Status
 */
export const BILL_STATUS = ['draft', 'finalized', 'cancelled'] as const;

/**
 * Day Workflow Status
 */
export const DAY_WORKFLOW_STATUS = ['not_started', 'in_progress', 'completed'] as const;

/**
 * Token Configuration
 */
export const TOKEN_CONFIG = {
  STORAGE_KEY: 'auth_token',
  ROLE_STORAGE_KEY: 'user_role',
  USER_STORAGE_KEY: 'user_info',
} as const;