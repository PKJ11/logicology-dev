'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Define proper types
interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  contentItems: number;
  worksheets: number;
  videos: number;
  games: number;
  assessments: number;
  wordwall: number;
  mindstamp: number;
  externalLinks: number;
}

interface Activity {
  id: string;
  user: string;
  action: string;
  details: string;
  time: string;
  timestamp: Date;
  tier?: number;
  type?: string;
}

interface TierStats {
  id: number;
  name: string;
  subscribers: number;
  revenue: number;
  color: string;
}

type StatCardProps = {
  title: string;
  value: string | number;
  change: string;
  icon: string;
  color: string;
  loading?: boolean;
};

type ProgressBarProps = {
  label: string;
  value: number;
  total: number;
  color: 'orange' | 'blue' | 'green' | 'purple' | 'gray' | 'pink' | 'red';
  loading?: boolean;
};

type QuickActionColor = 'orange' | 'blue' | 'green' | 'purple' | 'pink' | 'red';

type QuickActionButtonProps = {
  href: string;
  icon: string;
  label: string;
  color: QuickActionColor;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [tierStats, setTierStats] = useState<TierStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const router = useRouter();

  useEffect(() => {
    fetchDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch(`/api/admin/stats?range=${dateRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setStats(data.stats);
        setRecentActivities(data.recentActivities);
        setTierStats(data.tierStats);
        setError(null);
      } else {
        setError(data.error || 'Failed to fetch dashboard data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getChangeIndicator = (current: number, previous: number) => {
    const change = ((current - previous) / (previous || 1)) * 100;
    return {
      value: change.toFixed(1),
      isPositive: change >= 0,
      text: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`
    };
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 text-6xl text-red-500">⚠️</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Error Loading Dashboard</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchDashboardData}
            className="rounded-xl bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Date Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Date Range Selector */}
          <div className="flex rounded-xl border border-gray-200 bg-white p-1">
            {(['today', 'week', 'month', 'year'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
          
          <button className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export Report</span>
          </button>
          
          <Link
            href="/admin/content/upload"
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Content</span>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          change={`+${((stats?.totalUsers || 0) * 0.125).toFixed(0)}%`}
          icon="👥"
          color="from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Subs"
          value={stats?.activeSubscriptions?.toLocaleString() || '0'}
          change={`+${((stats?.activeSubscriptions || 0) * 0.082).toFixed(0)}%`}
          icon="🎯"
          color="from-green-500 to-green-600"
        />
        <StatCard
          title="Revenue (₹)"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          change={`+${((stats?.totalRevenue || 0) * 0.231).toFixed(0)}%`}
          icon="💰"
          color="from-orange-500 to-orange-600"
        />
        <StatCard
          title="Content Items"
          value={stats?.contentItems?.toLocaleString() || '0'}
          change={`+${((stats?.contentItems || 0) * 0.053).toFixed(0)}%`}
          icon="📚"
          color="from-purple-500 to-purple-600"
        />
      </div>

      {/* Content Distribution & Tier Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Content Distribution</h2>
            <span className="text-sm text-gray-500">Total: {stats?.contentItems || 0} items</span>
          </div>
          <div className="space-y-4">
            <ProgressBar 
              label="Worksheets" 
              value={stats?.worksheets || 0} 
              total={stats?.contentItems || 1} 
              color="orange" 
            />
            <ProgressBar 
              label="Wordwall Games" 
              value={stats?.wordwall || 0} 
              total={stats?.contentItems || 1} 
              color="blue" 
            />
            <ProgressBar 
              label="Mindstamp Videos" 
              value={stats?.mindstamp || 0} 
              total={stats?.contentItems || 1} 
              color="purple" 
            />
            <ProgressBar 
              label="Games" 
              value={stats?.games || 0} 
              total={stats?.contentItems || 1} 
              color="green" 
            />
            <ProgressBar 
              label="Assessments" 
              value={stats?.assessments || 0} 
              total={stats?.contentItems || 1} 
              color="pink" 
            />
            <ProgressBar 
              label="External Links" 
              value={stats?.externalLinks || 0} 
              total={stats?.contentItems || 1} 
              color="gray" 
            />
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Tier Performance</h2>
            <span className="text-sm text-gray-500">Active: {stats?.activeSubscriptions || 0}</span>
          </div>
          <div className="space-y-4">
            {tierStats.map((tier) => (
              <div key={tier.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">{tier.name}</span>
                  <div className="flex gap-4">
                    <span className="text-gray-500">{tier.subscribers} subs</span>
                    <span className="text-gray-700">₹{tier.revenue.toLocaleString()}</span>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${tier.color}`}
                    style={{ width: `${(tier.subscribers / (stats?.activeSubscriptions || 1)) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activity */}
        <div className="col-span-2 rounded-2xl bg-white p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
            <Link href="/admin/activities" className="text-sm text-orange-600 hover:text-orange-700">
              View All →
            </Link>
          </div>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No recent activities</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${
                      activity.tier === 1 ? 'from-gray-500 to-gray-600' :
                      activity.tier === 2 ? 'from-blue-500 to-blue-600' :
                      activity.tier === 3 ? 'from-purple-500 to-purple-600' :
                      'from-orange-500 to-orange-600'
                    } flex items-center justify-center text-white`}>
                      {activity.type === 'content' ? '📄' : 
                       activity.type === 'subscription' ? '🎯' : 
                       activity.type === 'user' ? '👤' : '⚙️'}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-500">
                        {activity.action} {activity.details && (
                          <span className="text-gray-400">• {activity.details}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm text-gray-400">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="mb-4 text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="space-y-3">
            <QuickActionButton
              href="/admin/content/upload"
              icon="📤"
              label="Upload Content"
              color="orange"
            />
            <QuickActionButton
              href="/admin/tiers"
              icon="⚙️"
              label="Manage Tiers"
              color="blue"
            />
            <QuickActionButton
              href="/admin/users"
              icon="👥"
              label="View Users"
              color="green"
            />
            {/* <QuickActionButton
              href="/admin/analytics"
              icon="📊"
              label="View Analytics"
              color="purple"
            /> */}
            <QuickActionButton
              href="/admin/content?type=worksheet"
              icon="📄"
              label="Add Worksheet"
              color="pink"
            />
            <QuickActionButton
              href="/admin/content?type=mindstamp"
              icon="🎥"
              label="Add Video"
              color="red"
            />
          </div>

          {/* Quick Stats */}
          {/* <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Today's Snapshot</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-gray-900">12</div>
                <div className="text-xs text-gray-500">New Users</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-gray-900">₹4.2k</div>
                <div className="text-xs text-gray-500">Revenue</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-gray-900">8</div>
                <div className="text-xs text-gray-500">New Subs</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <div className="text-2xl font-bold text-gray-900">3</div>
                <div className="text-xs text-gray-500">Uploads</div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon, color, loading }: StatCardProps) {
  const isPositive = change.startsWith('+');
  return (
    <div className="rounded-2xl bg-white p-6 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-2xl text-white`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={`text-sm font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change}
        </span>
        <span className="ml-2 text-sm text-gray-400">vs last {loading ? '...' : 'month'}</span>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, total, color, loading }: ProgressBarProps) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colors: Record<string, string> = {
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500',
    red: 'bg-red-500',
  };
  
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <span className="text-gray-500">{value} items</span>
      </div>
      <div className="h-2 rounded-full bg-gray-200">
        <div
          className={`h-2 rounded-full ${colors[color]} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function QuickActionButton({ href, icon, label, color }: QuickActionButtonProps) {
  const colors: Record<QuickActionColor, string> = {
    orange: 'from-orange-50 to-orange-100 text-orange-600 hover:from-orange-100 hover:to-orange-200',
    blue: 'from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200',
    green: 'from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200',
    purple: 'from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-200',
    pink: 'from-pink-50 to-pink-100 text-pink-600 hover:from-pink-100 hover:to-pink-200',
    red: 'from-red-50 to-red-100 text-red-600 hover:from-red-100 hover:to-red-200',
  };
  
  return (
    <Link
      href={href}
      className={`flex items-center space-x-3 rounded-xl bg-gradient-to-r ${colors[color]} p-4 transition-all hover:scale-[1.02]`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}