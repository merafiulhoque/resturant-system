// src/components/admin/WalletDisplay.tsx

'use client';

import { useEffect, useState } from 'react';
import { IWallet, ITransaction } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Wallet, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/token';

export default function WalletDisplay() {
  const [walletData, setWalletData] = useState<IWallet | null>(null);
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        return;
      }

      // Fetch wallet
      const walletResponse = await fetch('/api/wallet', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!walletResponse.ok) {
        throw new Error('Failed to fetch wallet');
      }

      const walletData = await walletResponse.json();
      setWalletData(walletData.data || null);

      // Fetch transactions
      const transactionsResponse = await fetch('/api/wallet/transactions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!transactionsResponse.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const transactionsData = await transactionsResponse.json();
      setTransactions(transactionsData.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wallet data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Wallet</h2>
        <p className="text-gray-400 mt-1">Manage your restaurant finances</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cash Balance */}
        <div className="bg-gradient-to-br from-green-900 to-green-800 border border-green-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-green-200 text-sm mb-1">Cash Balance</p>
              <p className="text-3xl font-bold text-white">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {walletData?.cashBalance.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-800 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-green-300" />
            </div>
          </div>
          <p className="text-green-200 text-xs">Available cash</p>
        </div>

        {/* UPI Balance */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 border border-blue-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-blue-200 text-sm mb-1">UPI Balance</p>
              <p className="text-3xl font-bold text-white">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {walletData?.upiBalance.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-blue-300" />
            </div>
          </div>
          <p className="text-blue-200 text-xs">Available via UPI</p>
        </div>

        {/* Total Balance */}
        <div className="bg-gradient-to-br from-orange-900 to-orange-800 border border-orange-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-orange-200 text-sm mb-1">Total Balance</p>
              <p className="text-3xl font-bold text-white">
                {APP_CONFIG.CURRENCY_SYMBOL}
                {walletData?.totalBalance.toLocaleString() || '0'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-800 rounded-lg flex items-center justify-center">
              <Wallet className="w-6 h-6 text-orange-300" />
            </div>
          </div>
          <p className="text-orange-200 text-xs">Combined balance</p>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Recent Transactions</h3>
        </div>

        {transactions.length === 0 ? (
          <div className="p-8 text-center">
            <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Method</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Amount</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-700 hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === 'credit' ? (
                          <>
                            <TrendingUp className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-medium text-green-400 capitalize">
                              {transaction.type}
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingDown className="w-4 h-4 text-red-400" />
                            <span className="text-sm font-medium text-red-400 capitalize">
                              {transaction.type}
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-300 capitalize">{transaction.method}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-sm font-bold ${
                          transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {transaction.type === 'credit' ? '+' : '-'}
                        {APP_CONFIG.CURRENCY_SYMBOL}
                        {transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400 line-clamp-1">
                        {transaction.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-400">
                        {new Date(transaction.createdAt || '').toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}