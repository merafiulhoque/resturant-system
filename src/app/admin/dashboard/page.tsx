// src/app/admin/dashboard/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { Users, UtensilsCrossed, Wallet, TrendingUp } from 'lucide-react';
import { APP_CONFIG } from '@/constants';

interface DashboardStats {
  totalStaff: number;
  totalMenuItems: number;
  walletBalance: number;
  todayRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStaff: 0,
    totalMenuItems: 0,
    walletBalance: 0,
    todayRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        // For now, we'll show placeholder data
        // Later, we'll implement actual API calls
        setStats({
          totalStaff: 8,
          totalMenuItems: 24,
          walletBalance: 45000,
          todayRevenue: 12500,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
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
        <p className="text-gray-400">Here's what's happening in your restaurant today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Staff Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Staff</p>
              <p className="text-3xl font-bold text-white">{stats.totalStaff}</p>
            </div>
            <div className="w-12 h-12 bg-blue-900 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Active staff members</p>
        </div>

        {/* Total Menu Items Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Menu Items</p>
              <p className="text-3xl font-bold text-white">{stats.totalMenuItems}</p>
            </div>
            <div className="w-12 h-12 bg-green-900 rounded-lg flex items-center justify-center">
              <UtensilsCrossed className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Available items</p>
        </div>

        {/* Wallet Balance Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Wallet Balance</p>
              <p className="text-3xl font-bold text-white">{APP_CONFIG.CURRENCY_SYMBOL}{stats.walletBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-purple-900 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Total balance</p>
        </div>

        {/* Today's Revenue Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-orange-500 transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-400 text-sm mb-1">Today's Revenue</p>
              <p className="text-3xl font-bold text-white">{APP_CONFIG.CURRENCY_SYMBOL}{stats.todayRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-orange-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-gray-500 text-xs">Today's earnings</p>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="bg-orange-600 hover:bg-orange-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            + Add Staff Member
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            + Add Menu Item
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            View Reports
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors">
            Manage Workflow
          </button>
        </div>
      </div>
    </div>
  );
}