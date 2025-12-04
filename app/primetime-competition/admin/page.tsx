// app/primetime-competition/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Move, 
  Trash2, 
  Search, 
  Save, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  UserPlus,
  UserMinus,
  Download,
  Upload
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'school' | 'non-school';
  paymentStatus: 'pending' | 'completed' | 'exempted';
  competitionSlot?: {
    boardNumber: number;
    day: 'saturday' | 'sunday';
    timeSlot: string;
  };
  selectedSlot?: {
    day: 'saturday' | 'sunday';
    timeSlot: string;
  };
}

interface Board {
  _id: string;
  boardNumber: number;
  day: 'saturday' | 'sunday';
  timeSlot: string;
  currentUsers: number;
  maxUsers: number;
  users: User[];
  lastUpdated: Date;
}

export default function AdminBoardManagement() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [unassignedUsers, setUnassignedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('11:30-13:30');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const timeSlots = [
    { value: '11:30-13:30', label: '11:30 AM - 1:30 PM' },
    { value: '14:30-16:30', label: '2:30 PM - 4:30 PM' }
  ];

  useEffect(() => {
    fetchAllData();
  }, [selectedDay, selectedTimeSlot]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [boardsRes, unassignedRes] = await Promise.all([
        fetch(`/api/primetime/admin/boards?day=${selectedDay}&timeSlot=${selectedTimeSlot}`),
        fetch(`/api/primetime/admin/users?day=${selectedDay}`)
      ]);

      if (boardsRes.ok) {
        const boardsData = await boardsRes.json();
        setBoards(boardsData.boards || []);
      }

      if (unassignedRes.ok) {
        const unassignedData = await unassignedRes.json();
        setUnassignedUsers(unassignedData.users || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Failed to load data' });
    } finally {
      setLoading(false);
    }
  };

  const moveUserToBoard = async (userId: string, boardNumber: number, action: 'add' | 'remove') => {
    try {
      setSaving(true);
      const response = await fetch('/api/primetime/admin/assign-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          boardNumber,
          day: selectedDay,
          timeSlot: selectedTimeSlot,
          action
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchAllData(); // Refresh all data
        setSelectedUser(null); // Clear selection
      } else {
        setMessage({ type: 'error', text: data.error || 'Operation failed' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const removeUserFromBoard = async (userId: string, boardNumber: number) => {
    await moveUserToBoard(userId, boardNumber, 'remove');
  };

  const assignUserToBoard = async (userId: string, boardNumber: number) => {
    await moveUserToBoard(userId, boardNumber, 'add');
  };

  const deleteUnassignedUser = async (userId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/primetime/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        setUnassignedUsers(prev => prev.filter(user => user._id !== userId));
        setShowDeleteConfirm(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignedUser = async (userId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/primetime/admin/users/${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchAllData(); // Refresh all data
        setShowDeleteConfirm(null);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to delete user' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const resetAllAssignments = async () => {
    if (!confirm('Are you sure you want to unassign ALL users from boards? This cannot be undone.')) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch('/api/primetime/admin/reset-assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          day: selectedDay,
          timeSlot: selectedTimeSlot
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message });
        fetchAllData();
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to reset assignments' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(`/api/primetime/admin/export?day=${selectedDay}&timeSlot=${selectedTimeSlot}`);
      const data = await response.blob();
      
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `board-assignments-${selectedDay}-${selectedTimeSlot}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Export error:', error);
      setMessage({ type: 'error', text: 'Failed to export data' });
    }
  };

  const filteredUnassignedUsers = unassignedUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Board Management - Admin Panel
          </h1>
          <p className="text-gray-600">
            All users start as unassigned. Assign them manually to boards.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Day
                </label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as 'saturday' | 'sunday')}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Slot
                </label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2"
                >
                  {timeSlots.map(slot => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>

              <button
                onClick={resetAllAssignments}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg"
              >
                <UserMinus className="w-4 h-4" />
                Unassign All
              </button>

              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 ${
              message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <AlertCircle className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Unassigned Users */}
          <div className="bg-white rounded-xl shadow">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Unassigned Users
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({unassignedUsers.length} users)
                  </span>
                </h2>
                <button
                  onClick={fetchAllData}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                  title="Refresh"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              
              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search unassigned users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : filteredUnassignedUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? 'No matching users found' : 'No unassigned users'}
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {filteredUnassignedUsers.map(user => (
                    <div
                      key={user._id}
                      className={`p-3 border rounded-lg ${
                        selectedUser?._id === user._id 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      } cursor-pointer`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.userType === 'school' 
                                ? 'bg-green-100 text-green-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {user.userType}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              user.paymentStatus === 'completed' || user.paymentStatus === 'exempted'
                                ? 'bg-green-100 text-green-700'
                                : user.paymentStatus === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {user.paymentStatus}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(user);
                            }}
                            className="p-1 hover:bg-blue-100 rounded"
                            title="Select for assignment"
                          >
                            <Move className="w-4 h-4 text-blue-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(user._id);
                            }}
                            className="p-1 hover:bg-red-100 rounded"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {showDeleteConfirm === user._id && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <p className="text-sm text-red-700 mb-2">
                            Delete this user permanently? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUnassignedUser(user._id);
                              }}
                              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(null);
                              }}
                              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle: Boards Grid */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Boards - {selectedDay} ({selectedTimeSlot})
              </h2>
              <div className="text-sm text-gray-500">
                Total assigned: {boards.reduce((sum, board) => sum + board.users.length, 0)} users
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }, (_, i) => i + 1).map(boardNum => {
                const board = boards.find(b => b.boardNumber === boardNum);
                const users = board?.users || [];
                const isFull = users.length >= 6;

                return (
                  <div
                    key={boardNum}
                    className={`bg-white rounded-xl shadow border-2 ${
                      isFull ? 'border-red-300' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h2 className="text-lg font-semibold">
                          Board {boardNum}
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({users.length}/6)
                          </span>
                        </h2>
                        {isFull && (
                          <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-700 rounded-full">
                            FULL
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className={`min-h-[200px] p-2 rounded-lg ${
                        selectedUser ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : 'bg-gray-50'
                      }`}>
                        {users.length === 0 ? (
                          <div className="text-center py-8 text-gray-400">
                            No users assigned
                            {selectedUser && (
                              <p className="text-sm mt-2">
                                Drop or click to assign {selectedUser.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {users.map(user => (
                              <div
                                key={user._id}
                                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded"
                              >
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                  <div className="flex gap-1 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      user.userType === 'school' 
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-blue-100 text-blue-700'
                                    }`}>
                                      {user.userType}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => removeUserFromBoard(user._id, boardNum)}
                                    className="p-1 hover:bg-yellow-50 rounded"
                                    title="Unassign from board"
                                  >
                                    <UserMinus className="w-4 h-4 text-yellow-500" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowDeleteConfirm(`assigned-${user._id}`);
                                      setSelectedUser(user);
                                    }}
                                    className="p-1 hover:bg-red-50 rounded"
                                    title="Delete user"
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {!isFull && selectedUser && (
                          <div className="mt-4">
                            <button
                              onClick={() => assignUserToBoard(selectedUser._id, boardNum)}
                              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2"
                            >
                              <UserPlus className="w-4 h-4" />
                              Assign {selectedUser.name}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected User Info */}
            {selectedUser && (
              <div className="mt-6 p-4 bg-white rounded-xl shadow">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">Selected User</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{selectedUser.name}</h4>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedUser.userType === 'school' 
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {selectedUser.userType}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          selectedUser.paymentStatus === 'completed' || selectedUser.paymentStatus === 'exempted'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {selectedUser.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {selectedUser.selectedSlot?.day && `Selected: ${selectedUser.selectedSlot.day}`}
                      </p>
                      {selectedUser.competitionSlot && (
                        <p className="text-sm text-green-600 font-medium">
                          Assigned to Board {selectedUser.competitionSlot.boardNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click on a board to assign this user
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Delete Confirmation Modal */}
      {showDeleteConfirm && showDeleteConfirm.startsWith('assigned-') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete User</h3>
            <p className="text-gray-600 mb-4">
              Are you sure you want to permanently delete {selectedUser?.name}? 
              This will remove the user from the database and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  deleteAssignedUser(selectedUser!._id);
                }}
                disabled={saving}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? 'Deleting...' : 'Delete Permanently'}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setSelectedUser(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}