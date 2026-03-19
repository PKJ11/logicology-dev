'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Tier } from '@/app/types/subscription';

interface CommunityUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  lastActive?: string;
  otpVerified?: boolean;
  source?: string;
}

interface Subscription {
  _id: string;
  userId: string;
  tierId: number;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
  paymentId?: string;
  autoRenew: boolean;
}

interface UserWithSubscription {
  _id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string; // Changed from Date to string
  lastActive?: string; // Changed from Date to optional string
  subscription?: {
    tierId: number;
    status: string;
    startDate: string; // Changed from Date to string
    endDate: string; // Changed from Date to string
    paymentId?: string;
    autoRenew: boolean;
  };
  totalSpent: number;
  activities: number;
  source?: string;
  otpVerified?: boolean;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserWithSubscription[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithSubscription[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [subscriptions, setSubscriptions] = useState<Map<string, Subscription>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserWithSubscription | null>(null);
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    freeUsers: 0,
    totalRevenue: 0
  });

  useEffect(() => {
    Promise.all([fetchUsers(), fetchTiers(), fetchSubscriptions()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    applyFilters();
    calculateStats();
  }, [users, subscriptions, searchQuery, selectedTier, selectedStatus]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/community-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTiers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTiers(data.tiers);
    } catch (err) {
      console.error('Error fetching tiers:', err);
    }
  };

  const fetchSubscriptions = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/subscriptions', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const subMap = new Map();
        data.subscriptions.forEach((sub: Subscription) => {
          subMap.set(sub.userId, sub);
        });
        setSubscriptions(subMap);
      }
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    if (selectedTier !== 'all') {
      filtered = filtered.filter(u => {
        const sub = subscriptions.get(u._id);
        return sub?.tierId === selectedTier;
      });
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(u => {
        const sub = subscriptions.get(u._id);
        if (selectedStatus === 'free') return !sub;
        return sub?.status === selectedStatus;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.phone?.includes(query) ||
        u._id.includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const calculateStats = () => {
    let active = 0;
    let free = 0;
    let revenue = 0;

    users.forEach(user => {
      const sub = subscriptions.get(user._id);
      if (sub) {
        if (sub.status === 'active') {
          active++;
          const tier = tiers.find(t => t.id === sub.tierId);
          if (tier) revenue += tier.price;
        }
      } else {
        free++;
      }
    });

    setUserStats({
      totalUsers: users.length,
      activeSubscriptions: active,
      freeUsers: free,
      totalRevenue: revenue
    });
  };

  const getUserSubscription = (userId: string) => {
    return subscriptions.get(userId);
  };

  const getStatusColor = (status: string = 'inactive') => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'expired': return 'bg-red-100 text-red-700 border-red-200';
      case 'cancelled': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getTimeAgo = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading community users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">👥 Community Members</h1>
          <p className="mt-2 text-gray-600">
            Total {userStats.totalUsers} member{userStats.totalUsers !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              fetchUsers();
              fetchSubscriptions();
            }}
            className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh</span>
          </button>
          <button className="flex items-center space-x-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Members</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Subs</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.activeSubscriptions}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Free Users</p>
              <p className="text-3xl font-bold text-gray-900">{userStats.freeUsers}</p>
            </div>
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl">
              🆓
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Monthly Revenue</p>
              <p className="text-3xl font-bold text-gray-900">₹{userStats.totalRevenue}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
              💰
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="Search by name, email, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">📊 All Tiers</option>
            {tiers.map(tier => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">📋 All Status</option>
            <option value="active">✅ Active</option>
            <option value="expired">❌ Expired</option>
            <option value="cancelled">⚠️ Cancelled</option>
            <option value="free">🆓 Free Tier</option>
          </select>
          <button
            onClick={() => {
              setSelectedTier('all');
              setSelectedStatus('all');
              setSearchQuery('');
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl bg-white shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Member</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Subscription</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                {/* <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Last Active</th> */}
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const subscription = getUserSubscription(user._id);
                const isFree = !subscription;
                
                return (
                  <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{user.name || 'Unnamed User'}</div>
                          <div className="text-xs text-gray-500 font-mono">ID: {user._id.slice(-8)}</div>
                          {user.source && (
                            <div className="text-xs text-gray-400">Source: {user.source}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div>{user.email || 'No email'}</div>
                        <div className="text-gray-500">{user.phone || 'No phone'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {!isFree && subscription ? (
                        <div>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold text-white ${
                            subscription.tierId === 1 ? 'bg-gray-500' :
                            subscription.tierId === 2 ? 'bg-blue-500' :
                            subscription.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
                          }`}>
                            {tiers.find(t => t.id === subscription.tierId)?.name || `Tier ${subscription.tierId}`}
                          </span>
                          {subscription.endDate && (
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(subscription.endDate) > new Date() ? 'Valid till: ' : 'Expired: '}
                              {formatDate(subscription.endDate)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          🆓 Free Tier
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {!isFree && subscription ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                          {subscription.status}
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                          🆓 Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    {/* <td className="px-6 py-4 text-sm text-gray-500">
                      {getTimeAgo(user.lastActive)}
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (subscription) {
                              setSelectedUser({
                                ...user,
                                subscription: {
                                  tierId: subscription.tierId,
                                  status: subscription.status,
                                  startDate: subscription.startDate,
                                  endDate: subscription.endDate,
                                  paymentId: subscription.paymentId,
                                  autoRenew: subscription.autoRenew
                                }
                              });
                            } else {
                              setSelectedUser(user);
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="View Details"
                        >
                          👁️
                        </button>
                        <button
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="Edit User"
                        >
                          ✏️
                        </button>
                        {!isFree && (
                          <button
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Cancel Subscription"
                          >
                            ⚠️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredUsers.length} of {users.length} members
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">Previous</button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded-lg">1</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-gray-50 transition-colors">Next</button>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Member Details</h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* User Profile Header */}
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-4xl text-white font-bold shadow-lg">
                  {selectedUser.name ? selectedUser.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedUser.name || 'Unnamed User'}</h3>
                  <p className="text-gray-500 mt-1">{selectedUser.email || 'No email provided'}</p>
                  <p className="text-gray-500">{selectedUser.phone || 'No phone provided'}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      ID: {selectedUser._id}
                    </span>
                    {selectedUser.otpVerified && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                        ✅ Verified
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4">
                  <div className="text-sm text-blue-600 mb-1">Joined</div>
                  <div className="text-lg font-bold text-gray-900">{formatDate(selectedUser.createdAt)}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4">
                  <div className="text-sm text-purple-600 mb-1">Last Active</div>
                  <div className="text-lg font-bold text-gray-900">{getTimeAgo(selectedUser.lastActive)}</div>
                </div>
                {selectedUser.subscription ? (
                  <>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4">
                      <div className="text-sm text-green-600 mb-1">Subscription</div>
                      <div className="text-lg font-bold text-gray-900">
                        {tiers.find(t => t.id === selectedUser.subscription?.tierId)?.name}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4">
                      <div className="text-sm text-orange-600 mb-1">Valid Until</div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatDate(selectedUser.subscription.endDate)}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="col-span-2 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4">
                    <div className="text-sm text-gray-600 mb-1">Subscription</div>
                    <div className="text-lg font-bold text-gray-900">🆓 Free Tier User</div>
                  </div>
                )}
              </div>

              {/* Subscription Details */}
              {selectedUser.subscription && (
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-900 mb-3">Subscription Details</h4>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">
                        {tiers.find(t => t.id === selectedUser.subscription?.tierId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(selectedUser.subscription.status)}`}>
                        {selectedUser.subscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Start Date:</span>
                      <span>{formatDate(selectedUser.subscription.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">End Date:</span>
                      <span>{formatDate(selectedUser.subscription.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Auto Renew:</span>
                      <span className={selectedUser.subscription.autoRenew ? 'text-green-600' : 'text-gray-500'}>
                        {selectedUser.subscription.autoRenew ? '✅ Yes' : '❌ No'}
                      </span>
                    </div>
                    {selectedUser.subscription.paymentId && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-sm">{selectedUser.subscription.paymentId}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Activity Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Recent Activity</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Logged in</span>
                      <span className="text-gray-400 ml-auto">{getTimeAgo(selectedUser.lastActive)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Joined community</span>
                      <span className="text-gray-400 ml-auto">{formatDate(selectedUser.createdAt)}</span>
                    </div>
                    {selectedUser.otpVerified && (
                      <div className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-gray-600">Verified phone number</span>
                        <span className="text-gray-400 ml-auto">Verified</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-8">
                <button className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors">
                  Send Message
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  View History
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}