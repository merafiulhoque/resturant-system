'use client';

import { useEffect, useState } from 'react';
import { X, Edit3, Type, AlignLeft, DollarSign, Tag, ImageIcon, CheckCircle, User } from 'lucide-react';
import { IMenuItem } from '@/types';
import { MENU_CATEGORIES } from '@/constants';
import { validateData, updateMenuItemSchema } from '@/lib/utils/validators';
import { getAuthToken } from '@/lib/utils/token';

interface EditMenuModalProps {
  isOpen: boolean;
  menuItem: IMenuItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditMenuModal({ isOpen, menuItem, onClose, onSuccess }: EditMenuModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
    category: string;
    image: string;
    isAvailable: boolean;
  }>({
    name: '',
    description: '',
    price: '',
    category: MENU_CATEGORIES[0] as string,
    image: '',
    isAvailable: true,
  });

  // Populate form when menu item changes
  useEffect(() => {
    if (menuItem) {
      setFormData({
        name: menuItem.name || '',
        description: menuItem.description || '',
        price: menuItem.price.toString() || '',
        category: (menuItem.category as string) || MENU_CATEGORIES[0],
        image: menuItem.image || '',
        isAvailable: menuItem.isAvailable ?? true,
      });
    }
  }, [menuItem, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!menuItem?._id) {
        setError('Menu item ID not found');
        setLoading(false);
        return;
      }

      // Validate form data
      const validation = validateData(updateMenuItemSchema, {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image || undefined,
        isAvailable: formData.isAvailable,
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
      const response = await fetch(`/api/menu/${menuItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(validation.data),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to update menu item');
        setLoading(false);
        return;
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !menuItem) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-slate-800/90 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 bg-gradient-to-r from-orange-600/20 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-600/20">
              <Edit3 className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">Edit Menu Item</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 animate-pulse">
              <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Name Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Type className="w-4 h-4" />
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Margherita Pizza"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <AlignLeft className="w-4 h-4" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe the item, ingredients, etc."
              rows={3}
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 resize-none disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <DollarSign className="w-4 h-4" />
              Price ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>

          {/* Category Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Tag className="w-4 h-4" />
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 appearance-none rounded-lg bg-slate-900/50 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {MENU_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          </div>

          {/* Image URL Field */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <ImageIcon className="w-4 h-4" />
              Image URL <span className="text-slate-500 font-normal">(Optional)</span>
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 disabled:cursor-not-allowed"
              disabled={loading}
            />
          </div>

          {/* Availability Toggle */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-900/50 border border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircle className={`w-5 h-5 ${formData.isAvailable ? 'text-green-400' : 'text-slate-500'}`} />
              <label className="text-sm font-medium text-slate-300 cursor-pointer">
                Available for Order
              </label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleInputChange}
                className="sr-only peer"
                disabled={loading}
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-slate-700/50 text-slate-300 font-medium hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-orange-600 to-orange-500 text-white font-medium hover:from-orange-700 hover:to-orange-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-600/30"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                'Update Item'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}