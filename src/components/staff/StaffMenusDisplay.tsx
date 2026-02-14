// src/components/staff/StaffMenusDisplay.tsx

'use client';

import { useEffect, useState } from 'react';
import { IMenuItem } from '@/types';
import { APP_CONFIG, MENU_CATEGORIES } from '@/constants';
import { Search, Image as ImageIcon } from 'lucide-react';
import MenuCard from '../admin/MenuCard';
import { getAuthToken } from '@/lib/utils/token';

export default function StaffMenusDisplay() {
  const [menuList, setMenuList] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();

      if (!token) {
        setError('No authentication token found');
        return;
      }

      const response = await fetch('/api/menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }

      const data = await response.json();
      // Only show available items to staff
      setMenuList((data.data || []).filter((item: IMenuItem) => item.isAvailable));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch menu items');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading menus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white">Available Menus</h2>
        <p className="text-gray-400 mt-1">Browse available menu items</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All
          </button>
          {MENU_CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
            <p className="text-gray-400">No menu items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item._id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-colors h-full flex flex-col">
              {/* Image */}
              <div className="relative h-32 bg-gray-900 flex items-center justify-center overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-1 text-gray-500">
                    <ImageIcon className="w-6 h-6" />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-3 space-y-2 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-white line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-gray-700">
                  <div>
                    <p className="text-xs text-gray-400">Price</p>
                    <p className="text-sm font-bold text-blue-400">
                      {APP_CONFIG.CURRENCY_SYMBOL}
                      {item.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Category</p>
                    <p className="text-xs font-medium text-white">{item.category}</p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-white mt-1">{menuList.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg Price</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">
            {APP_CONFIG.CURRENCY_SYMBOL}
            {(menuList.reduce((sum, i) => sum + i.price, 0) / menuList.length || 0).toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}