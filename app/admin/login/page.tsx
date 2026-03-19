'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.admin));
        router.push('/admin');
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Side - Gradient Background */}
      <div className="hidden w-1/2 bg-gradient-to-br from-orange-500 to-orange-600 lg:block">
        <div className="flex h-full flex-col items-center justify-center p-12 text-white">
          <div className="relative mb-8 h-32 w-64">
            <Image
              src="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png"
              alt="Mathology Logo"
              fill
              className="object-contain"
            />
          </div>
          <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
          <p className="mb-8 text-center text-lg opacity-90">
            Manage your content, tiers, and users all in one place.
          </p>
          {/* Stats cards remain the same */}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex w-full items-center justify-center p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <div className="relative mx-auto mb-4 h-16 w-48">
              <Image
                src="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png"
                alt="Mathology Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h2 className="mb-2 text-3xl font-bold text-gray-900">Admin Login</h2>
          <p className="mb-8 text-gray-600">Enter your credentials to access the dashboard</p>

          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="admin@mathology.com"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 font-semibold text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center justify-center space-x-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Logging in...</span>
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}