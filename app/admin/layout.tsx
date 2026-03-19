'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken && pathname !== '/admin/login') {
        router.push('/admin/login');
      } else {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAdminAuth();
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 transform bg-white shadow-2xl transition-all duration-300 ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-20 -translate-x-full lg:translate-x-0'
        } lg:relative`}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-gray-200 px-4">
          <div className={`flex items-center space-x-3 ${!isSidebarOpen && 'lg:hidden'}`}>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600"></div>
            <span className="text-xl font-bold text-gray-800">Admin</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            <NavItem href="/admin" icon="📊" label="Dashboard" isOpen={isSidebarOpen} />
            <NavItem href="/admin/tiers" icon="🎯" label="Tiers" isOpen={isSidebarOpen} />
            <NavItem href="/admin/content" icon="📚" label="Content" isOpen={isSidebarOpen} />
            <NavItem href="/admin/worksheets" icon="📄" label="Worksheets" isOpen={isSidebarOpen} />
            <NavItem href="/admin/videos" icon="🎥" label="Videos" isOpen={isSidebarOpen} />
            <NavItem href="/admin/games" icon="🎮" label="Games" isOpen={isSidebarOpen} />
            <NavItem href="/admin/assessments" icon="📝" label="Assessments" isOpen={isSidebarOpen} />
            <NavItem href="/admin/users" icon="👥" label="Users" isOpen={isSidebarOpen} />
            {/* <NavItem href="/admin/analytics" icon="📈" label="Analytics" isOpen={isSidebarOpen} /> */}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <button
            onClick={() => {
              localStorage.removeItem('adminToken');
              router.push('/admin/login');
            }}
            className={`flex w-full items-center space-x-3 rounded-lg px-4 py-3 text-gray-700 transition-colors hover:bg-red-50 hover:text-red-600 ${
              !isSidebarOpen && 'lg:justify-center'
            }`}
          >
            <span className="text-xl">🚪</span>
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-white shadow-sm">
          <div className="flex h-20 items-center justify-between px-6">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-64 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                  3
                </span>
              </button>

              <div className="h-10 w-10 overflow-hidden rounded-xl bg-gradient-to-r from-orange-500 to-orange-600">
                <div className="flex h-full w-full items-center justify-center text-xl font-bold text-white">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, isOpen }: { href: string; icon: string; label: string; isOpen: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all ${
          isActive
            ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-gray-100'
        } ${!isOpen && 'lg:justify-center'}`}
      >
        <span className="text-xl">{icon}</span>
        {isOpen && <span>{label}</span>}
      </Link>
    </li>
  );
}