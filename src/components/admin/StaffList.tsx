// src/components/admin/StaffList.tsx

'use client';

import { useEffect, useState } from 'react';
import { IStaff } from '@/types';
import { APP_CONFIG } from '@/constants';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';

export default function StaffList() {
  const [staffList, setStaffList] = useState<IStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<IStaff | null>(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
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

      const response = await fetch('/api/staff', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch staff');
      }

      const data = await response.json();
      setStaffList(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staffList.filter(
    (staff) =>
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading staff...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Staff Management</h2>
          <p className="text-gray-400 mt-1">Manage your restaurant staff</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-lg font-medium transition-colors flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Staff
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
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
          <p className="text-gray-400 text-sm">Total Staff</p>
          <p className="text-2xl font-bold text-white mt-1">{staffList.length}</p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Active Staff</p>
          <p className="text-2xl font-bold text-green-400 mt-1">
            {staffList.filter((s) => s.isActive).length}
          </p>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Payroll</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">
            {APP_CONFIG.CURRENCY_SYMBOL}
            {staffList.reduce((sum, s) => sum + (s.salary || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        {filteredStaff.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-400">No staff members found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              {/* Table Header */}
              <thead className="bg-gray-900 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Position</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Salary</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">Status</th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>

              {/* Table Body */}
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff._id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 text-sm text-white font-medium">{staff.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{staff.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{staff.position}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {staff.isoCode} {staff.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      {APP_CONFIG.CURRENCY_SYMBOL}
                      {staff.salary?.toLocaleString() || '0'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          staff.isActive
                            ? 'bg-green-900 text-green-200'
                            : 'bg-red-900 text-red-200'
                        }`}
                      >
                        {staff.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsEditModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-blue-300 transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStaff(staff);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-red-900 hover:bg-red-800 text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      

      {/* Add Staff Modal */}
      <AddStaffModal 
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchStaff}
      />

      {/* Edit Staff Modal */}
      <EditStaffModal 
        isOpen={isEditModalOpen}
        staff={selectedStaff}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedStaff(null);
        }}
        onSuccess={fetchStaff}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
        itemName={selectedStaff?.name || ''}
        itemId={selectedStaff?._id || ''}
        apiEndpoint="/api/staff"
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStaff(null);
        }}
        onSuccess={fetchStaff}
      />
    </div>
  );
}