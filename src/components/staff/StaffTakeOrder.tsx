// src/components/staff/StaffTakeOrder.tsx

'use client';

import { useEffect, useState } from 'react';
import { IMenuItem, IOrderItem } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Plus, Trash2, ShoppingCart } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/token';

export default function StaffTakeOrder() {
  const [menuList, setMenuList] = useState<IMenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      setMenuList((data.data || []).filter((item: IMenuItem) => item.isAvailable));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const addItemToOrder = (item: IMenuItem) => {
    const existingItem = orderItems.find((oi) => oi.menuItemId === item._id);

    if (existingItem) {
      setOrderItems((prev) =>
        prev.map((oi) =>
          oi.menuItemId === item._id
            ? { ...oi, quantity: oi.quantity + 1, subtotal: (oi.quantity + 1) * oi.price }
            : oi
        )
      );
    } else {
      setOrderItems((prev) => [
        ...prev,
        {
          menuItemId: item._id || '',
          name: item.name,
          price: item.price,
          quantity: 1,
          subtotal: item.price,
        },
      ]);
    }
  };

  const updateQuantity = (menuItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(menuItemId);
      return;
    }

    setOrderItems((prev) =>
      prev.map((oi) =>
        oi.menuItemId === menuItemId
          ? { ...oi, quantity: newQuantity, subtotal: newQuantity * oi.price }
          : oi
      )
    );
  };

  const removeItem = (menuItemId: string) => {
    setOrderItems((prev) => prev.filter((oi) => oi.menuItemId !== menuItemId));
  };

  const handleSubmitOrder = async () => {
    if (orderItems.length === 0) {
      setError('Please add items to order');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        setSubmitting(false);
        return;
      }

      const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          totalAmount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to create order');
        setSubmitting(false);
        return;
      }

      // Success - clear order
      setOrderItems([]);
      setError('');
      alert('Order created successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const filteredMenu = menuList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Take Order</h2>
        <p className="text-gray-400 mt-1">Create a new customer order</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Menu Items Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />

          {/* Menu Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredMenu.length === 0 ? (
              <div className="col-span-full p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
                <p className="text-gray-400">No items found</p>
              </div>
            ) : (
              filteredMenu.map((item) => (
                <div
                  key={item._id}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors"
                >
                  <h3 className="font-bold text-white text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-blue-400 font-bold text-lg my-2">
                    {APP_CONFIG.CURRENCY_SYMBOL}
                    {item.price}
                  </p>
                  <button
                    onClick={() => addItemToOrder(item)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Order Summary</h3>
          </div>

          {/* Order Items */}
          <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
            {orderItems.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">No items added</p>
            ) : (
              orderItems.map((item) => (
                <div key={item.menuItemId} className="bg-gray-900 rounded-lg p-3 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-xs">
                        {APP_CONFIG.CURRENCY_SYMBOL}
                        {item.price} x {item.quantity}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.menuItemId)}
                      className="p-1 rounded hover:bg-gray-800 text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quantity Control */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.menuItemId, parseInt(e.target.value) || 1)}
                      className="w-12 bg-gray-700 text-white text-center rounded text-sm py-1"
                    />
                    <button
                      onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded text-sm"
                    >
                      +
                    </button>
                    <span className="ml-auto text-blue-400 font-bold text-sm">
                      {APP_CONFIG.CURRENCY_SYMBOL}
                      {item.subtotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-4"></div>

          {/* Total */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Items:</span>
              <span className="text-white font-bold">{orderItems.length}</span>
            </div>
            <div className="flex justify-between items-center text-lg">
              <span className="text-white font-bold">Total:</span>
              <span className="text-blue-400 font-bold">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {totalAmount.toLocaleString()}
              </span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitOrder}
              disabled={orderItems.length === 0 || submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-bold transition-colors mt-4"
            >
              {submitting ? 'Creating Order...' : 'Create Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}