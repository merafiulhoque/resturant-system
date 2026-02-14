// src/components/LoginForm.tsx

'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { APP_CONFIG, FRONTEND_ROUTES } from '@/constants';
import { loginSchema } from '@/lib/utils/validators';
import { ChefHat, Eye, EyeOff } from 'lucide-react';
import { setAuthToken } from '@/lib/utils/token';

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = (searchParams.get('role') as 'admin' | 'staff') || 'admin';

  const [role, setRole] = useState<'admin' | 'staff'>(roleParam);
  const [email, setEmail] = useState(roleParam === 'admin' ? 'admin@yummy.com' : '');
  const [password, setPassword] = useState(roleParam === 'admin' ? 'Admin@123' : '');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate input
      const validation = loginSchema.safeParse({
        email,
        password,
        role,
      });

      if (!validation.success) {
        const firstIssue = validation.error?.issues[0];
        setError(firstIssue?.message || 'Validation failed');
        setLoading(false);
        return;
      }

      // Call login API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Login failed');
        setLoading(false);
        return;
      }

      console.log('Login response:', data);

      // Store token in cookie
      setAuthToken(data.data.token);

      console.log('Stored auth_token in cookie');

      // Redirect based on role
      if (role === 'admin') {
        router.push(FRONTEND_ROUTES.ADMIN_DASHBOARD);
      } else {
        router.push(FRONTEND_ROUTES.STAFF_DASHBOARD);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <ChefHat className="w-12 h-12 text-orange-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">{APP_CONFIG.APP_NAME}</h1>
            <p className="text-gray-400 text-sm mt-2">Restaurant Management System</p>
          </div>

          {/* Role Selector */}
          <div className="mb-6 flex gap-2">
            <button
              onClick={() => {
                setRole('admin');
                setEmail('admin@yummy.com');
                setPassword('Admin@123');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                role === 'admin'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setRole('staff');
                setEmail('');
                setPassword('');
              }}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                role === 'staff'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Staff
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-900 border border-red-700 text-red-200 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
                role === 'admin'
                  ? 'bg-orange-600 hover:bg-orange-700 disabled:bg-orange-800'
                  : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Back Link */}
          <div className="mt-6 text-center">
            <Link
              href={FRONTEND_ROUTES.HOME}
              className="text-orange-500 hover:text-orange-400 text-sm font-medium transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Info Message */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>
            {role === 'admin'
              ? 'Admin account credentials will be set up during initial setup.'
              : 'Contact your admin for staff credentials.'}
          </p>
        </div>
      </div>
    </div>
  );
}