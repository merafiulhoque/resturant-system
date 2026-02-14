// src/components/LandingPage.tsx

'use client';

import Link from 'next/link';
import { APP_CONFIG, FRONTEND_ROUTES } from '@/constants';
import { ChefHat, Users } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-white">{APP_CONFIG.APP_NAME}</h1>
          </div>
          <p className="text-gray-400">{APP_CONFIG.APP_TAGLINE}</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-bold text-white mb-6">
            Welcome to {APP_CONFIG.APP_NAME}
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Streamline your restaurant operations with our powerful management system. Manage staff,
            menus, orders, and finances all in one place.
          </p>
        </div>

        {/* Login Options */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Admin Login */}
          <Link href={FRONTEND_ROUTES.LOGIN + '?role=admin'}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-2xl hover:border-orange-500 transition-all duration-300 p-8 cursor-pointer transform hover:scale-105">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">Admin Login</h3>
              <p className="text-gray-400 text-center mb-6">
                Manage your restaurant, staff, menus, and analytics from the admin dashboard.
              </p>
              <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-orange-600 hover:to-red-700 transition-colors">
                Login as Admin
              </div>
            </div>
          </Link>

          {/* Staff Login */}
          <Link href={FRONTEND_ROUTES.LOGIN + '?role=staff'}>
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg hover:shadow-2xl hover:border-blue-500 transition-all duration-300 p-8 cursor-pointer transform hover:scale-105">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                  <ChefHat className="w-10 h-10 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white text-center mb-4">Staff Login</h3>
              <p className="text-gray-400 text-center mb-6">
                Take orders, prepare bills, and manage your daily operations with ease.
              </p>
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold text-center hover:from-blue-600 hover:to-cyan-700 transition-colors">
                Login as Staff
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-950 border-t border-gray-700 mt-20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-white mb-12">Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Staff Management</h4>
              <p className="text-gray-400">Easily manage and track your restaurant staff</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Menu Management</h4>
              <p className="text-gray-400">Create and manage your restaurant menu items</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Order Management</h4>
              <p className="text-gray-400">Process orders and generate bills efficiently</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-700 text-gray-400 py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 {APP_CONFIG.APP_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}