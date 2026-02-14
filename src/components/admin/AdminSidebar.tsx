// src/components/admin/AdminSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants';
import {
  ChefHat,
  Users,
  UtensilsCrossed,
  Wallet,
  Workflow,
  FileText,
  DollarSign,
  BarChart3,
  LogOut,
} from 'lucide-react';
import { clearAuthToken } from '@/lib/utils/token';

const ADMIN_MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: FRONTEND_ROUTES.ADMIN_DASHBOARD,
    icon: ChefHat,
  },
  {
    label: 'Staff Management',
    href: FRONTEND_ROUTES.ADMIN_STAFF,
    icon: Users,
  },
  {
    label: 'Menu Management',
    href: FRONTEND_ROUTES.ADMIN_MENU,
    icon: UtensilsCrossed,
  },
  {
    label: 'Wallet',
    href: FRONTEND_ROUTES.ADMIN_WALLET,
    icon: Wallet,
  },
  {
    label: 'Manage Workflow',
    href: FRONTEND_ROUTES.ADMIN_WORKFLOW,
    icon: Workflow,
  },
  {
    label: 'Update Bill',
    href: FRONTEND_ROUTES.ADMIN_UPDATE_BILL,
    icon: FileText,
  },
  {
    label: 'Staff Pay',
    href: FRONTEND_ROUTES.ADMIN_STAFF_PAY,
    icon: DollarSign,
  },
  {
    label: 'Analytics',
    href: FRONTEND_ROUTES.ADMIN_ANALYTICS,
    icon: BarChart3,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    clearAuthToken();
    
    // Redirect to home
    setTimeout(() => {
      window.location.href = FRONTEND_ROUTES.HOME;
    }, 100);
  };

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 min-h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <Link href={FRONTEND_ROUTES.ADMIN_DASHBOARD} className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-orange-500" />
          <span className="text-xl font-bold text-white">YUMMY</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {ADMIN_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  active
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-red-900 hover:bg-red-800 text-red-100 transition-colors font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}