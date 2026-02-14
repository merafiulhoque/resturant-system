// src/components/admin/CashTransferModal.tsx

'use client';

import { useState } from 'react';
import { X, ArrowRightLeft } from 'lucide-react';
import { validateData, cashTransferSchema } from '@/lib/utils/validators';
import { getAuthToken } from '@/lib/utils/token';

interface CashTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CashTransferModal({ isOpen, onClose, onSuccess }: CashTransferModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    amount: '',
    from: 'cash' as 'cash' | 'upi',
    to: 'upi' as 'cash' | 'upi',
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSwap = () => {
    setFormData((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate form data
      const validation = validateData(cashTransferSchema, {
        amount: parseFloat(formData.amount),
        from: formData.from,
        to: formData.to,
        notes: formData.notes || undefined,
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
      const response = await fetch('/api/workflow/cash-transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to transfer cash');
        setLoading(false);
        return;
      }

      // Reset form and close modal
      setFormData({
        amount: '',
        from: 'cash',
        to: 'upi',
        notes: '',
      });

      onSuccess();
      onClose();
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
          <h3 className="text-xl font-bold text-white">Transfer Cash</h3>
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
            Transfer money between cash and UPI accounts
          </p>

          {/* Transfer Route */}
          <div className="space-y-3">
            {/* From */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">From</label>
              <select
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSwap}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                disabled={loading}
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* To */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">To</label>
              <select
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="cash">Cash</option>
                <option value="upi">UPI</option>
              </select>
            </div>
          </div>

          {/* Amount Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter transfer amount"
              step="0.01"
              min="0"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Notes Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any notes about this transfer"
              rows={3}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
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
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Transferring...' : 'Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}