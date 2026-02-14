// src/components/staff/TakeOrderModal.tsx

'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { IMenuItem, IOrderItem } from '@/types';
import { APP_CONFIG } from '@/constants';
import { getAuthToken } from '@/lib/utils/token';

const TABLE_NUMBERS = Array.from({ length: 20 }, (_, i) => i + 1);

interface TakeOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCreated: () => void;
  occupiedTables: number[];
}

export default function TakeOrderModal({
  isOpen,
  onClose,
  onOrderCreated,
  occupiedTables,
}: TakeOrderModalProps) {
  const [tableNo, setTableNo] = useState<number | ''>('');
  const [menuItems, setMenuItems] = useState<IMenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchMenuItems();
    }
  }, [isOpen]);

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
      setMenuItems((data.data || []).filter((item: IMenuItem) => item.isAvailable));
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
    if (!tableNo) {
      setError('Please select a table number');
      return;
    }

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
          tableNo,
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

      // Success - reset form
      setTableNo('');
      setOrderItems([]);
      setError('');
      onOrderCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const availableTables = TABLE_NUMBERS.filter((t) => !occupiedTables.includes(t));

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-gray-800 border border-gray-700 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-white">Take Order</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-6 pt-4 pb-0">
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Table Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Table</label>
            <select
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value ? parseInt(e.target.value) : '')}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- Choose Table --</option>
              {availableTables.map((table) => (
                <option key={table} value={table}>
                  Table {table}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Items Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Select Items</label>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-400">Loading menu items...</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {menuItems.map((item) => (
                  <button
                    key={item._id}
                    onClick={() => addItemToOrder(item)}
                    className="bg-gray-700 hover:bg-gray-600 border border-gray-600 hover:border-blue-500 rounded-lg p-3 text-left transition-all"
                  >
                    <p className="text-white font-medium text-sm line-clamp-1">{item.name}</p>
                    <p className="text-blue-400 font-bold text-sm">
                      {APP_CONFIG.CURRENCY_SYMBOL}
                      {item.price}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Order Items Summary */}
          <div className="bg-gray-900 rounded-lg p-4">
            <h4 className="text-white font-bold mb-3">Order Items</h4>
            {orderItems.length === 0 ? (
              <p className="text-gray-400 text-sm">No items added yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {orderItems.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium line-clamp-1">{item.name}</p>
                      <p className="text-gray-400 text-xs">
                        {APP_CONFIG.CURRENCY_SYMBOL}
                        {item.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 ml-3">
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                        className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white w-6 text-center text-sm font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                        className="p-1 bg-gray-700 hover:bg-gray-600 rounded text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.menuItemId)}
                        className="p-1 bg-red-900 hover:bg-red-800 rounded text-red-300 ml-2"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-blue-400 font-bold text-sm ml-3 whitespace-nowrap">
                      {APP_CONFIG.CURRENCY_SYMBOL}
                      {item.subtotal.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="border-t border-gray-700 mt-3 pt-3 flex justify-between items-center">
              <span className="text-white font-bold">Total:</span>
              <span className="text-blue-400 font-bold text-lg">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSubmitOrder}
            disabled={!tableNo || orderItems.length === 0 || submitting}
            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Order'}
          </button>
        </div>
      </div>
    </div>
  );
}