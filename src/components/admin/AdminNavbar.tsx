// src/components/admin/AdminNavbar.tsx

'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { getUserFromToken } from '@/lib/utils/token';

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone: string;
  isoCode: string;
}

export default function AdminNavbar() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getUserFromToken();
    if (user) {
      setUserInfo({
        _id: user.userId,
        name: user.email.split('@')[0],
        email: user.email,
        role: user.role,
        phone: '',
        isoCode: '',
      });
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between gap-8">
      {/* Left Section - Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage your restaurant operations</p>
      </div>

      {/* Right Section - Notifications & User */}
      <div className="flex items-center gap-6 flex-shrink-0">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        {userInfo && (
          <div className="flex items-center gap-3 pl-6 border-l border-gray-700">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              {userInfo.name.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{userInfo.name}</p>
              <p className="text-xs text-gray-400">{userInfo.email}</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}