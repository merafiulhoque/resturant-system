// src/app/api/orders/route.ts

import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/db/connect';
import { Order } from '@/lib/db/models/Order';
import { MenuItem } from '@/lib/db/models/MenuItem';
import { Staff } from '@/lib/db/models/Staff';
import { authenticateRequest } from '@/lib/utils/auth';
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  serverErrorResponse,
} from '@/lib/utils/api-response';
import { UserRole, IOrderItem } from '@/types';
import { ERROR_MESSAGES, ORDER_STATUS } from '@/constants';

/**
 * POST /api/orders
 * Staff only → Create order
 */
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticateRequest(request);
    if (!auth.isValid || auth.payload?.role !== UserRole.STAFF) {
      return unauthorizedResponse(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const body = await request.json();
    const items = body.items as any[];
    const tableNo = Number(body.tableNo);

    if (!Array.isArray(items) || items.length === 0) {
      return errorResponse('Order must contain at least one item', 400);
    }

    if (!tableNo || tableNo <= 0) {
      return errorResponse('Invalid table number', 400);
    }

    const staff = await Staff.findById(String(auth.payload.userId));
    if (!staff) {
      return unauthorizedResponse('Staff not found');
    }

    const recalculatedItems: IOrderItem[] = [];
    let totalAmount = 0;

    for (const item of items) {
      const menu = await MenuItem.findById(String(item.menuItemId));
      if (!menu || !menu.isAvailable) {
        return errorResponse('Menu item unavailable', 400);
      }

      const quantity = Number(item.quantity);
      if (!quantity || quantity <= 0) {
        return errorResponse('Invalid quantity', 400);
      }

      const subtotal = Number(menu.price) * quantity;
      totalAmount += subtotal;

      recalculatedItems.push({
        menuItemId: String(menu._id),
        name: String(menu.name),
        price: Number(menu.price),
        quantity,
        subtotal,
      });
    }

    const order = await Order.create({
      adminId: String(staff.adminId),
      staffId: String(staff._id),
      tableNo,
      items: recalculatedItems,
      totalAmount,
      orderStatus: ORDER_STATUS[0],
    });

    return successResponse(order, 'Order created successfully', 201);
  } catch (error) {
    console.error('TAKE_ORDER_ERROR:', error);
    return serverErrorResponse(ERROR_MESSAGES.SERVER_ERROR);
  }
}

/**
 * GET /api/orders
 * Admin → all orders
 * Staff → own orders
 */
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const auth = await authenticateRequest(request);
    if (!auth.isValid) {
      return unauthorizedResponse(ERROR_MESSAGES.UNAUTHORIZED);
    }

    const filter: any = {};

    if (auth.payload?.role === UserRole.ADMIN) {
      filter.adminId = String(auth.payload.userId);
    }

    if (auth.payload?.role === UserRole.STAFF) {
      const staff = await Staff.findById(String(auth.payload.userId));
      if (!staff) {
        return unauthorizedResponse('Staff not found');
      }
      filter.adminId = String(staff.adminId);
      filter.staffId = String(staff._id);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    return successResponse(orders, 'Orders fetched successfully', 200);
  } catch (error) {
    console.error('FETCH_ORDERS_ERROR:', error);
    return serverErrorResponse(ERROR_MESSAGES.SERVER_ERROR);
  }
}
