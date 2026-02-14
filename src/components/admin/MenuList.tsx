// src/components/admin/MenuList.tsx

'use client';

import { useEffect, useState } from 'react';
import { IMenuItem } from '@/types';
import { APP_CONFIG, MENU_CATEGORIES } from '@/constants';
import { Plus, Search } from 'lucide-react';
import MenuCard from './MenuCard';
import AddMenuModal from './AddMenuModal';
import EditMenuModal from './EditMenuModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function MenuList() {
  const [menuList, setMenuList] = useState<IMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<IMenuItem | null>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const token = document.cookie
        .split('; ')
        .find((row) => row.startsWith('auth_token='))
        ?.split('=')[1];

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
      setMenuList(data.data || []);
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
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Menu Management</h2>
          <p className="text-gray-400 mt-1">Manage your restaurant menu items</p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Menu Item
        </button>
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
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedCategory === 'All'
                ? 'bg-orange-600 text-white'
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
                  ? 'bg-orange-600 text-white'
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

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-2xl font-bold text-white mt-1">{menuList.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Available Items</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {menuList.filter((i) => i.isAvailable).length}
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Avg Price</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {APP_CONFIG.CURRENCY_SYMBOL}
            {(menuList.reduce((sum, i) => sum + i.price, 0) / menuList.length || 0).toFixed(0)}
          </p>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full p-8 bg-gray-800 border border-gray-700 rounded-lg text-center">
            <p className="text-gray-400">No menu items found</p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <MenuCard
              key={item._id}
              item={item}
              onEdit={(menuItem) => {
                setSelectedMenuItem(menuItem);
                setIsEditModalOpen(true);
              }}
              onDelete={(menuItem) => {
                setSelectedMenuItem(menuItem);
                setIsDeleteModalOpen(true);
              }}
            />
          ))
        )}
      </div>

      

      {/* Modals */}
      <AddMenuModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMenuItems}
      />

      <EditMenuModal
        isOpen={isEditModalOpen}
        menuItem={selectedMenuItem}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedMenuItem(null);
        }}
        onSuccess={fetchMenuItems}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Menu Item"
        message="Are you sure you want to delete this menu item? This action cannot be undone."
        itemName={selectedMenuItem?.name || ''}
        itemId={selectedMenuItem?._id || ''}
        apiEndpoint="/api/menu"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedMenuItem(null);
        }}
        onSuccess={fetchMenuItems}
      />
    </div>
  );
}