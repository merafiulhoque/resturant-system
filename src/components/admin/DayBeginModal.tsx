// src/components/admin/DayBeginModal.tsx

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { validateData, dayWorkflowSchema } from '@/lib/utils/validators';
import { getAuthToken } from '@/lib/utils/token';

interface DayBeginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DayBeginModal({ isOpen, onClose, onSuccess }: DayBeginModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    openingBalanceCash: '',
    openingBalanceUpi: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      const validation = validateData(dayWorkflowSchema, {
        openingBalanceCash: parseFloat(formData.openingBalanceCash) || 0,
        openingBalanceUpi: parseFloat(formData.openingBalanceUpi) || 0,
      });

      if (!validation.success) {
        const firstIssue = validation.error?.issues[0];
        setError(firstIssue?.message || 'Validation failed');
        setLoading(false);
        return;
      }

      // Get token
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // Call API
      const response = await fetch('/api/workflow/day-begin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to begin day');
        setLoading(false);
        return;
      }

      // Reset form and close modal
      setFormData({
        openingBalanceCash: '',
        openingBalanceUpi: '',
      });

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Begin Your Day</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-gray-400 text-sm">
            Enter your opening balances for the day
          </p>

          {/* Opening Cash Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Opening Cash Balance
            </label>
            <input
              type="number"
              name="openingBalanceCash"
              value={formData.openingBalanceCash}
              onChange={handleInputChange}
              placeholder="Enter opening cash balance"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Opening UPI Balance */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Opening UPI Balance
            </label>
            <input
              type="number"
              name="openingBalanceUpi"
              value={formData.openingBalanceUpi}
              onChange={handleInputChange}
              placeholder="Enter opening UPI balance"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Day'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}