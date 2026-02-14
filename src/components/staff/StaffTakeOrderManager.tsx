// src/components/staff/StaffTakeOrderManager.tsx

'use client';

import { useEffect, useState } from 'react';
import { IOrder } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Plus, X } from 'lucide-react';
import TakeOrderModal from './TakeOrderModal';
import { getAuthToken } from '@/lib/utils/token';

export default function StaffTakeOrderManager() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActiveOrders();
  }, []);

  const fetchActiveOrders = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      // Show only pending orders
      setActiveOrders((data.data || []).filter((order: IOrder) => order.orderStatus === 'pending'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOrderCreated = () => {
    fetchActiveOrders();
  };

  const getOccupiedTables = (): number[] => {
    return activeOrders.map((order) => (order as any).tableNo || 0).filter((t) => t > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Take Order</h2>
          <p className="text-gray-400 mt-1">Manage customer orders</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          New Order
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Active Orders Grid */}
      <div>
        <h3 className="text-lg font-bold text-white mb-4">Active Orders</h3>
        {activeOrders.length === 0 ? (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center">
            <p className="text-gray-400">No active orders. Click "New Order" to create one.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeOrders.map((order) => {
              const tableNo = (order as any).tableNo || 'N/A';
              const itemCount = order.items.length;
              const total = order.totalAmount;

              return (
                <div key={order._id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-blue-500 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-gray-400 text-sm">Table</p>
                      <p className="text-2xl font-bold text-white">#{tableNo}</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-900 text-blue-200 rounded-full text-xs font-medium">
                      Active
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-gray-300">{item.name} x{item.quantity}</span>
                        <span className="text-blue-400 font-medium">
                          {APP_CONFIG.CURRENCY_SYMBOL}
                          {item.subtotal.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">{itemCount} items</span>
                      <span className="text-blue-400 font-bold">
                        {APP_CONFIG.CURRENCY_SYMBOL}
                        {total.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors">
                    Proceed to Bill
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      <TakeOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onOrderCreated={handleOrderCreated}
        occupiedTables={getOccupiedTables()}
      />
    </div>
  );
}