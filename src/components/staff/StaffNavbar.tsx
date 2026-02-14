// src/components/staff/StaffNavbar.tsx

'use client';

import { useEffect, useState } from 'react';
import { Bell, User } from 'lucide-react';
import { getUserFromToken } from '@/lib/utils/token';

interface UserInfo {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export default function StaffNavbar() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = getUserFromToken();
    if (user) {
      setUserInfo(user);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <nav className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex items-center justify-between gap-8">
      {/* Left Section - Title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
        <p className="text-gray-400 text-sm">Manage orders and bills</p>
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
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {userInfo.email.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{userInfo.email.split('@')[0]}</p>
              <p className="text-xs text-gray-400">Staff</p>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}