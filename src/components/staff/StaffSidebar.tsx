// src/components/staff/StaffSidebar.tsx

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FRONTEND_ROUTES } from '@/constants';
import {
  ChefHat,
  UtensilsCrossed,
  ShoppingCart,
  FileText,
  Clock,
  Wallet,
  LogOut,
} from 'lucide-react';
import { clearAuthToken } from '@/lib/utils/token';

const STAFF_MENU_ITEMS = [
  {
    label: 'Dashboard',
    href: FRONTEND_ROUTES.STAFF_DASHBOARD,
    icon: ChefHat,
  },
  {
    label: 'View Menus',
    href: FRONTEND_ROUTES.STAFF_MENUS,
    icon: UtensilsCrossed,
  },
  {
    label: 'Take Order',
    href: FRONTEND_ROUTES.STAFF_TAKE_ORDER,
    icon: ShoppingCart,
  },
  {
    label: 'Prepare Bill',
    href: FRONTEND_ROUTES.STAFF_PREPARE_BILL,
    icon: FileText,
  },
  {
    label: 'Today\'s Orders',
    href: FRONTEND_ROUTES.STAFF_TODAY_ORDERS,
    icon: Clock,
  },
  {
    label: 'Today\'s Bills',
    href: FRONTEND_ROUTES.STAFF_TODAY_BILLS,
    icon: FileText,
  },
  {
    label: 'Today\'s Report',
    href: FRONTEND_ROUTES.STAFF_TODAY_REPORT,
    icon: Clock,
  },
  {
    label: 'Wallet',
    href: FRONTEND_ROUTES.STAFF_WALLET,
    icon: Wallet,
  },
];

export default function StaffSidebar() {
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
        <Link href={FRONTEND_ROUTES.STAFF_DASHBOARD} className="flex items-center gap-2">
          <ChefHat className="w-8 h-8 text-blue-500" />
          <span className="text-xl font-bold text-white">YUMMY</span>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {STAFF_MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  active
                    ? 'bg-blue-600 text-white'
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