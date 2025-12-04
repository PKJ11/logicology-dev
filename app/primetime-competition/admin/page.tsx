// app/primetime-competition/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
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
  Upload,
} from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  userType: "school" | "non-school";
  paymentStatus: "pending" | "completed" | "exempted";
  competitionSlot?: {
    boardNumber: number;
    day: "saturday" | "sunday";
    timeSlot: string;
  };
  selectedSlot?: {
    day: "saturday" | "sunday";
    timeSlot: string;
  };
}

interface Board {
  _id: string;
  boardNumber: number;
  day: "saturday" | "sunday";
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
  const [selectedDay, setSelectedDay] = useState<"saturday" | "sunday">("saturday");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("11:30-13:30");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const timeSlots = [
    { value: "11:30-13:30", label: "11:30 AM - 1:30 PM" },
    { value: "14:30-16:30", label: "2:30 PM - 4:30 PM" },
  ];

  useEffect(() => {
    fetchAllData();
  }, [selectedDay, selectedTimeSlot]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [boardsRes, unassignedRes] = await Promise.all([
        fetch(`/api/primetime/admin/boards?day=${selectedDay}&timeSlot=${selectedTimeSlot}`),
        fetch(`/api/primetime/admin/users?day=${selectedDay}`),
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
      console.error("Error fetching data:", error);
      setMessage({ type: "error", text: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const moveUserToBoard = async (userId: string, boardNumber: number, action: "add" | "remove") => {
    try {
      setSaving(true);
      const response = await fetch("/api/primetime/admin/assign-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          boardNumber,
          day: selectedDay,
          timeSlot: selectedTimeSlot,
          action,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchAllData(); // Refresh all data
        setSelectedUser(null); // Clear selection
      } else {
        setMessage({ type: "error", text: data.error || "Operation failed" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const removeUserFromBoard = async (userId: string, boardNumber: number) => {
    await moveUserToBoard(userId, boardNumber, "remove");
  };

  const assignUserToBoard = async (userId: string, boardNumber: number) => {
    await moveUserToBoard(userId, boardNumber, "add");
  };

  const deleteUnassignedUser = async (userId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/primetime/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        setUnassignedUsers((prev) => prev.filter((user) => user._id !== userId));
        setShowDeleteConfirm(null);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete user" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const deleteAssignedUser = async (userId: string) => {
    try {
      setSaving(true);
      const response = await fetch(`/api/primetime/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchAllData(); // Refresh all data
        setShowDeleteConfirm(null);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete user" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const resetAllAssignments = async () => {
    if (
      !confirm("Are you sure you want to unassign ALL users from boards? This cannot be undone.")
    ) {
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/primetime/admin/reset-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: selectedDay,
          timeSlot: selectedTimeSlot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
        fetchAllData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to reset assignments" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
    }
  };

  const exportData = async () => {
    try {
      const response = await fetch(
        `/api/primetime/admin/export?day=${selectedDay}&timeSlot=${selectedTimeSlot}`
      );
      const data = await response.blob();

      const url = window.URL.createObjectURL(data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `board-assignments-${selectedDay}-${selectedTimeSlot}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      setMessage({ type: "error", text: "Failed to export data" });
    }
  };

  const filteredUnassignedUsers = unassignedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Board Management - Admin Panel</h1>
          <p className="text-gray-600">
            All users start as unassigned. Assign them manually to boards.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Day</label>
                <select
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value as "saturday" | "sunday")}
                  className="rounded-lg border border-gray-300 px-4 py-2"
                >
                  <option value="saturday">Saturday</option>
                  <option value="sunday">Sunday</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Time Slot</label>
                <select
                  value={selectedTimeSlot}
                  onChange={(e) => setSelectedTimeSlot(e.target.value)}
                  className="rounded-lg border border-gray-300 px-4 py-2"
                >
                  {timeSlots.map((slot) => (
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
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={resetAllAssignments}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
              >
                <UserMinus className="h-4 w-4" />
                Unassign All
              </button>

              <button
                onClick={exportData}
                className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Download className="h-4 w-4" />
                Export Data
              </button>
            </div>
          </div>

          {message && (
            <div
              className={`mt-4 flex items-center gap-2 rounded-lg p-3 ${
                message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              {message.text}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Unassigned Users */}
          <div className="rounded-xl bg-white shadow">
            <div className="border-b p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  Unassigned Users
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({unassignedUsers.length} users)
                  </span>
                </h2>
                <button
                  onClick={fetchAllData}
                  className="rounded-lg p-2 hover:bg-gray-100"
                  title="Refresh"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>

              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search unassigned users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-4">
              {loading ? (
                <div className="py-8 text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                </div>
              ) : filteredUnassignedUsers.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  {searchTerm ? "No matching users found" : "No unassigned users"}
                </div>
              ) : (
                <div className="max-h-[600px] space-y-3 overflow-y-auto">
                  {filteredUnassignedUsers.map((user) => (
                    <div
                      key={user._id}
                      className={`rounded-lg border p-3 ${
                        selectedUser?._id === user._id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      } cursor-pointer`}
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{user.name}</h3>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          <div className="mt-1 flex items-center gap-2">
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                user.userType === "school"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.userType}
                            </span>
                            <span
                              className={`rounded-full px-2 py-1 text-xs ${
                                user.paymentStatus === "completed" ||
                                user.paymentStatus === "exempted"
                                  ? "bg-green-100 text-green-700"
                                  : user.paymentStatus === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
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
                            className="rounded p-1 hover:bg-blue-100"
                            title="Select for assignment"
                          >
                            <Move className="h-4 w-4 text-blue-500" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDeleteConfirm(user._id);
                            }}
                            className="rounded p-1 hover:bg-red-100"
                            title="Delete user"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>

                      {showDeleteConfirm === user._id && (
                        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                          <p className="mb-2 text-sm text-red-700">
                            Delete this user permanently? This cannot be undone.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteUnassignedUser(user._id);
                              }}
                              className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                            >
                              Delete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowDeleteConfirm(null);
                              }}
                              className="rounded bg-gray-200 px-3 py-1 text-sm text-gray-700 hover:bg-gray-300"
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
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                Boards - {selectedDay} ({selectedTimeSlot})
              </h2>
              <div className="text-sm text-gray-500">
                Total assigned: {boards.reduce((sum, board) => sum + board.users.length, 0)} users
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((boardNum) => {
                const board = boards.find((b) => b.boardNumber === boardNum);
                const users = board?.users || [];
                const isFull = users.length >= 6;

                return (
                  <div
                    key={boardNum}
                    className={`rounded-xl border-2 bg-white shadow ${
                      isFull ? "border-red-300" : "border-gray-200"
                    }`}
                  >
                    <div className="border-b p-4">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                          Board {boardNum}
                          <span className="ml-2 text-sm font-normal text-gray-500">
                            ({users.length}/6)
                          </span>
                        </h2>
                        {isFull && (
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                            FULL
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-4">
                      <div
                        className={`min-h-[200px] rounded-lg p-2 ${
                          selectedUser
                            ? "border-2 border-dashed border-blue-300 bg-blue-50"
                            : "bg-gray-50"
                        }`}
                      >
                        {users.length === 0 ? (
                          <div className="py-8 text-center text-gray-400">
                            No users assigned
                            {selectedUser && (
                              <p className="mt-2 text-sm">
                                Drop or click to assign {selectedUser.name}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2">
                            {users.map((user) => (
                              <div
                                key={user._id}
                                className="flex items-center justify-between rounded border border-gray-200 bg-white p-2"
                              >
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{user.name}</p>
                                  <p className="text-xs text-gray-500">{user.email}</p>
                                  <div className="mt-1 flex gap-1">
                                    <span
                                      className={`rounded-full px-2 py-0.5 text-xs ${
                                        user.userType === "school"
                                          ? "bg-green-100 text-green-700"
                                          : "bg-blue-100 text-blue-700"
                                      }`}
                                    >
                                      {user.userType}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => removeUserFromBoard(user._id, boardNum)}
                                    className="rounded p-1 hover:bg-yellow-50"
                                    title="Unassign from board"
                                  >
                                    <UserMinus className="h-4 w-4 text-yellow-500" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setShowDeleteConfirm(`assigned-${user._id}`);
                                      setSelectedUser(user);
                                    }}
                                    className="rounded p-1 hover:bg-red-50"
                                    title="Delete user"
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
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
                              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2 text-white hover:bg-blue-700"
                            >
                              <UserPlus className="h-4 w-4" />
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
              <div className="mt-6 rounded-xl bg-white p-4 shadow">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Selected User</h3>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="rounded-full p-2 hover:bg-gray-100"
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <div className="rounded-lg bg-blue-50 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{selectedUser.name}</h4>
                      <p className="text-sm text-gray-600">{selectedUser.email}</p>
                      <p className="text-sm text-gray-600">{selectedUser.phone}</p>
                      <div className="mt-2 flex gap-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            selectedUser.userType === "school"
                              ? "bg-green-100 text-green-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {selectedUser.userType}
                        </span>
                        <span
                          className={`rounded-full px-2 py-1 text-xs ${
                            selectedUser.paymentStatus === "completed" ||
                            selectedUser.paymentStatus === "exempted"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {selectedUser.paymentStatus}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        {selectedUser.selectedSlot?.day &&
                          `Selected: ${selectedUser.selectedSlot.day}`}
                      </p>
                      {selectedUser.competitionSlot && (
                        <p className="text-sm font-medium text-green-600">
                          Assigned to Board {selectedUser.competitionSlot.boardNumber}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">Click on a board to assign this user</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Delete Confirmation Modal */}
      {showDeleteConfirm && showDeleteConfirm.startsWith("assigned-") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete User</h3>
            <p className="mb-4 text-gray-600">
              Are you sure you want to permanently delete {selectedUser?.name}? This will remove the
              user from the database and cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  deleteAssignedUser(selectedUser!._id);
                }}
                disabled={saving}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {saving ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(null);
                  setSelectedUser(null);
                }}
                className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300"
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
