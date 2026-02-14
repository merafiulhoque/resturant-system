// src/components/admin/AddStaffModal.tsx

'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { ISO_COUNTRY_CODES } from '@/constants';
import { validateData, createStaffSchema } from '@/lib/utils/validators';
import { getAuthToken } from '@/lib/utils/token';

interface AddStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isoCode: '+91',
    position: '',
    salary: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const validation = validateData(createStaffSchema, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        isoCode: formData.isoCode,
        position: formData.position,
        salary: formData.salary ? parseFloat(formData.salary) : undefined,
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
      const staffData = validation.data as { name: string; email: string; phone: string; isoCode: string; position: string; salary?: number };
      
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: staffData.name,
          email: staffData.email,
          phone: staffData.phone,
          isoCode: staffData.isoCode,
          position: staffData.position,
          salary: staffData.salary,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to add staff');
        setLoading(false);
        return;
      }

      // Reset form and close modal
      setFormData({
        name: '',
        email: '',
        phone: '',
        isoCode: '+91',
        position: '',
        salary: '',
        password: '',
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
      <div className="bg-gray-800 border border-gray-700 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h3 className="text-xl font-bold text-white">Add Staff Member</h3>
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

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter staff name"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter staff email"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
            <div className="flex gap-2">
              <select
                name="isoCode"
                value={formData.isoCode}
                onChange={handleInputChange}
                className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              >
                {ISO_COUNTRY_CODES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.code}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone number"
                className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={loading}
              />
            </div>
          </div>

          {/* Position Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              placeholder="e.g., Chef, Waiter, Manager"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Salary Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Salary (Optional)</label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Enter monthly salary"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              disabled={loading}
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Set staff member password"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
              className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}