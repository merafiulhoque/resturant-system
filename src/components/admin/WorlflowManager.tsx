// src/components/admin/WorkflowManager.tsx

'use client';

import { useEffect, useState } from 'react';
import { IDayWorkflow } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Play, Pause, CheckCircle, Calendar } from 'lucide-react';
import DayBeginModal from './DayBeginModal';
import CashTransferModal from './CashTransferModal';
import DayEndModal from './DayEndModal';
import { getAuthToken } from '@/lib/utils/token';

export default function WorkflowManager() {
  const [todayWorkflow, setTodayWorkflow] = useState<IDayWorkflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDayBeginOpen, setIsDayBeginOpen] = useState(false);
  const [isCashTransferOpen, setIsCashTransferOpen] = useState(false);
  const [isDayEndOpen, setIsDayEndOpen] = useState(false);

  useEffect(() => {
    fetchTodayWorkflow();
  }, []);

  const fetchTodayWorkflow = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/workflow/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workflow');
      }

      const data = await response.json();
      setTodayWorkflow(data.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch workflow');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-900 border-gray-700';
      case 'in_progress':
        return 'bg-blue-900 border-blue-700';
      case 'completed':
        return 'bg-green-900 border-green-700';
      default:
        return 'bg-gray-900 border-gray-700';
    }
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'not_started':
        return { text: 'Not Started', color: 'bg-gray-700 text-gray-200' };
      case 'in_progress':
        return { text: 'In Progress', color: 'bg-blue-700 text-blue-200' };
      case 'completed':
        return { text: 'Completed', color: 'bg-green-700 text-green-200' };
      default:
        return { text: 'Unknown', color: 'bg-gray-700 text-gray-200' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading workflow...</p>
        </div>
      </div>
    );
  }

  const statusBadge = getStatusBadge(todayWorkflow?.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Manage Workflow</h2>
        <p className="text-gray-400 mt-1">Control your daily restaurant operations</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Today's Status Card */}
      <div className={`border rounded-lg p-8 ${getStatusColor(todayWorkflow?.status)}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Calendar className="w-8 h-8 text-orange-400" />
            <div>
              <h3 className="text-2xl font-bold text-white">Today's Status</h3>
              <p className="text-gray-400">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
          <span className={`px-4 py-2 rounded-full font-semibold ${statusBadge.color}`}>
            {statusBadge.text}
          </span>
        </div>

        {/* Opening Balance */}
        {todayWorkflow?.status !== 'not_started' && (
          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
            <div>
              <p className="text-gray-400 text-sm">Opening Cash Balance</p>
              <p className="text-xl font-bold text-white mt-1">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {todayWorkflow?.openingBalance.cash.toLocaleString() || '0'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Opening UPI Balance</p>
              <p className="text-xl font-bold text-white mt-1">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {todayWorkflow?.openingBalance.upi.toLocaleString() || '0'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Day Begin Button */}
        <button
          onClick={() => setIsDayBeginOpen(true)}
          disabled={todayWorkflow?.status !== 'not_started'}
          className={`p-6 rounded-lg border-2 transition-all ${
            todayWorkflow?.status === 'not_started'
              ? 'border-green-600 bg-green-900 hover:bg-green-800 text-green-100 cursor-pointer'
              : 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          <Play className="w-6 h-6 mx-auto mb-3" />
          <p className="font-semibold">Day Begin</p>
          <p className="text-sm opacity-75 mt-1">Start your day</p>
        </button>

        {/* Cash Transfer Button */}
        <button
          onClick={() => setIsCashTransferOpen(true)}
          disabled={todayWorkflow?.status !== 'in_progress'}
          className={`p-6 rounded-lg border-2 transition-all ${
            todayWorkflow?.status === 'in_progress'
              ? 'border-blue-600 bg-blue-900 hover:bg-blue-800 text-blue-100 cursor-pointer'
              : 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          <Pause className="w-6 h-6 mx-auto mb-3" />
          <p className="font-semibold">Cash Transfer</p>
          <p className="text-sm opacity-75 mt-1">Transfer cash ↔ UPI</p>
        </button>

        {/* Day End Button */}
        <button
          onClick={() => setIsDayEndOpen(true)}
          disabled={todayWorkflow?.status !== 'in_progress'}
          className={`p-6 rounded-lg border-2 transition-all ${
            todayWorkflow?.status === 'in_progress'
              ? 'border-orange-600 bg-orange-900 hover:bg-orange-800 text-orange-100 cursor-pointer'
              : 'border-gray-700 bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
          }`}
        >
          <CheckCircle className="w-6 h-6 mx-auto mb-3" />
          <p className="font-semibold">Day End</p>
          <p className="text-sm opacity-75 mt-1">Close your day</p>
        </button>
      </div>

      {/* Day Summary */}
      {todayWorkflow?.status === 'completed' && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-bold text-white">Day Summary</h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Transactions</p>
              <p className="text-2xl font-bold text-white mt-2">
                {todayWorkflow.totalTransactions || 0}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Cash In</p>
              <p className="text-2xl font-bold text-green-400 mt-2">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {todayWorkflow.totalCashIn?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total UPI In</p>
              <p className="text-2xl font-bold text-blue-400 mt-2">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {todayWorkflow.totalUpiIn?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Closing Total</p>
              <p className="text-2xl font-bold text-orange-400 mt-2">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {(
                  (todayWorkflow.closingBalance.cash || 0) +
                  (todayWorkflow.closingBalance.upi || 0)
                ).toLocaleString()}
              </p>
            </div>
          </div>

          {todayWorkflow.notes && (
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-gray-400 text-sm mb-2">Notes</p>
              <p className="text-white">{todayWorkflow.notes}</p>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <DayBeginModal
        isOpen={isDayBeginOpen}
        onClose={() => setIsDayBeginOpen(false)}
        onSuccess={() => {
          fetchTodayWorkflow();
          setIsDayBeginOpen(false);
        }}
      />

      <CashTransferModal
        isOpen={isCashTransferOpen}
        onClose={() => setIsCashTransferOpen(false)}
        onSuccess={fetchTodayWorkflow}
      />

      <DayEndModal
        isOpen={isDayEndOpen}
        onClose={() => setIsDayEndOpen(false)}
        onSuccess={() => {
          fetchTodayWorkflow();
          setIsDayEndOpen(false);
        }}
      />
    </div>
  );
}