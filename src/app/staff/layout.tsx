// src/app/staff/layout.tsx

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import StaffSidebar from '@/components/staff/StaffSidebar';
import StaffNavbar from '@/components/staff/StaffNavbar';
import { FRONTEND_ROUTES } from '@/constants';
import { Menu, X } from 'lucide-react';
import { isAuthenticated, isStaff } from '@/lib/utils/token';

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated() || !isStaff()) {
      router.push(FRONTEND_ROUTES.LOGIN + '?role=staff');
      return;
    }

    setIsAuth(true);
    setIsLoading(false);

    // Close sidebar on mobile by default
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar - Desktop */}
      <div className="hidden md:block">
        <StaffSidebar />
      </div>

      {/* Sidebar - Mobile (Modal) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setSidebarOpen(false)}
          ></div>
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full">
            <StaffSidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar with Toggle */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 md:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex-1 md:flex-none">
            <StaffNavbar />
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}