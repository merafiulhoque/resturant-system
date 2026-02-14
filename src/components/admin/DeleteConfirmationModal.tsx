// src/components/admin/DeleteConfirmationModal.tsx

'use client';

import { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/token';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName: string;
  itemId: string;
  apiEndpoint: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  title,
  message,
  itemName,
  itemId,
  apiEndpoint,
  onClose,
  onSuccess,
}: DeleteConfirmationModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setError('');
    setLoading(true);

    try {
      // Get token
      const token = getAuthToken();
      if (!token) {
        setError('No authentication token found');
        setLoading(false);
        return;
      }

      // Call delete API
      const response = await fetch(`${apiEndpoint}/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to delete');
        setLoading(false);
        return;
      }

      // Success - close modal and refresh
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
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-sm w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-bold text-white">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-300">{message}</p>

          {itemName && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-lg">
              <p className="text-sm text-gray-300">
                Item to delete: <span className="font-bold text-red-200">{itemName}</span>
              </p>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-6 border-t border-gray-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}