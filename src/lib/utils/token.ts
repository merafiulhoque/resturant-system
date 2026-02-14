// src/lib/utils/token.ts

import { JwtPayload } from '@/types';

/**
 * Get cookie by name
 */
export const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

/**
 * Decode JWT token
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get auth token from cookie
 */
export const getAuthToken = (): string | null => {
  return getCookie('auth_token');
};

/**
 * Get user data from auth token
 */
export const getUserFromToken = (): JwtPayload | null => {
  const token = getAuthToken();
  if (!token) return null;
  return decodeToken(token);
};

/**
 * Get user role from auth token
 */
export const getUserRole = (): string | null => {
  const user = getUserFromToken();
  return user?.role || null;
};

/**
 * Get user ID from auth token
 */
export const getUserId = (): string | null => {
  const user = getUserFromToken();
  return user?.userId || null;
};

/**
 * Get user email from auth token
 */
export const getUserEmail = (): string | null => {
  const user = getUserFromToken();
  return user?.email || null;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Check if user is admin
 */
export const isAdmin = (): boolean => {
  return getUserRole() === 'admin';
};

/**
 * Check if user is staff
 */
export const isStaff = (): boolean => {
  return getUserRole() === 'staff';
};

/**
 * Set auth token in cookie
 */
export const setAuthToken = (token: string, expiryDays: number = 7): void => {
  document.cookie = `auth_token=${token}; path=/; max-age=${expiryDays * 24 * 60 * 60}`;
};

/**
 * Clear auth token from cookie
 */
export const clearAuthToken = (): void => {
  document.cookie = 'auth_token=; path=/; max-age=0';
};