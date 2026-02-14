// src/app/staff/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, FileText, Clock, Wallet } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

export default function StaffDashboard() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Welcome back!</h2>
        <p className="text-gray-400">Here's what you can do today</p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Take Order Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Take Order</p>
              <p className="text-2xl font-bold text-white">Start</p>
            </div>
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Create new orders</p>
        </div>

        {/* Prepare Bill Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-green-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Prepare Bill</p>
              <p className="text-2xl font-bold text-white">Draft</p>
            </div>
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Generate bills</p>
        </div>

        {/* Today's Orders Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Today's Orders</p>
              <p className="text-2xl font-bold text-white">0</p>
            </div>
            <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">View your orders</p>
        </div>

        {/* Wallet Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-purple-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Your Balance</p>
              <p className="text-2xl font-bold text-white">
                {APP_CONFIG.CURRENCY_SYMBOL}0
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Check wallet</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-blue-900 border border-blue-700 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-2">Get Started</h3>
        <p className="text-blue-200">
          Use the sidebar menu to navigate through different features. You can take orders, prepare bills, 
          and view your daily reports. All your data is synchronized in real-time.
        </p>
      </div>
    </div>
  );
}