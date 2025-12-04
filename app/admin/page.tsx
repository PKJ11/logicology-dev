// app/primetime-competition/admin/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Move,
  Trash2,
  Search,
  Filter,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
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

  const timeSlots = [
    { value: "11:30-13:30", label: "11:30 AM - 1:30 PM" },
    { value: "14:30-16:30", label: "2:30 PM - 4:30 PM" },
  ];

  useEffect(() => {
    fetchBoardData();
  }, [selectedDay, selectedTimeSlot]);

  const fetchBoardData = async () => {
    try {
      setLoading(true);
      const [boardsRes, unassignedRes] = await Promise.all([
        fetch(`/api/primetime/admin/boards?day=${selectedDay}&timeSlot=${selectedTimeSlot}`),
        fetch(`/api/primetime/admin/unassigned-users?day=${selectedDay}`),
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
        fetchBoardData(); // Refresh data
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

  const saveAllAssignments = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/primetime/admin/save-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          day: selectedDay,
          timeSlot: selectedTimeSlot,
          boards: boards.map((board) => ({
            boardNumber: board.boardNumber,
            userIds: board.users.map((user) => user._id),
          })),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: data.message });
      } else {
        setMessage({ type: "error", text: data.error || "Save failed" });
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setSaving(false);
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
            Manually assign users to boards. Drag and drop or click to move users.
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
                onClick={fetchBoardData}
                disabled={loading}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 hover:bg-gray-200"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </button>

              <button
                onClick={saveAllAssignments}
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <Save className="h-4 w-4" />
                Save All Changes
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
              <h2 className="text-xl font-semibold text-gray-800">
                Unassigned Users
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({unassignedUsers.length} users)
                </span>
              </h2>

              <div className="mt-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
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
                <div className="py-8 text-center text-gray-500">No unassigned users found</div>
              ) : (
                <div className="max-h-[600px] space-y-3 overflow-y-auto">
                  {filteredUnassignedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="cursor-pointer rounded-lg border border-gray-200 p-3 hover:bg-gray-50"
                      onClick={() => setSelectedUser(user)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
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
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {user.paymentStatus}
                            </span>
                          </div>
                        </div>
                        <Move className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Middle: Boards Grid */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => i + 1).map((boardNum) => {
                const board = boards.find((b) => b.boardNumber === boardNum);
                const users = board?.users || [];
                const isFull = users.length >= 6;

                return (
                  <div
                    key={boardNum}
                    className={`rounded-xl border-2 bg-white shadow ${isFull ? "border-red-300" : "border-gray-200"}`}
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
                      {/* Drop zone for drag and drop */}
                      <div
                        className={`min-h-[200px] rounded-lg p-2 ${
                          selectedUser
                            ? "border-2 border-dashed border-blue-300 bg-blue-50"
                            : "bg-gray-50"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (selectedUser && !isFull) {
                            assignUserToBoard(selectedUser._id, boardNum);
                          }
                        }}
                      >
                        {users.length === 0 ? (
                          <div className="py-8 text-center text-gray-400">
                            Drop users here or click to assign
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
                                </div>
                                <button
                                  onClick={() => removeUserFromBoard(user._id, boardNum)}
                                  className="rounded p-1 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {!isFull && (
                          <div className="mt-4">
                            <button
                              onClick={() => {
                                if (selectedUser) {
                                  assignUserToBoard(selectedUser._id, boardNum);
                                }
                              }}
                              disabled={!selectedUser || isFull}
                              className={`w-full rounded-lg py-2 ${
                                selectedUser && !isFull
                                  ? "bg-blue-600 text-white hover:bg-blue-700"
                                  : "cursor-not-allowed bg-gray-100 text-gray-400"
                              }`}
                            >
                              Assign Selected User
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
                <h3 className="mb-3 font-semibold text-gray-800">Selected User</h3>
                <div className="flex items-center justify-between rounded-lg bg-blue-50 p-3">
                  <div>
                    <h4 className="font-medium">{selectedUser.name}</h4>
                    <p className="text-sm text-gray-600">
                      {selectedUser.email} • {selectedUser.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="rounded-full p-2 hover:bg-blue-100"
                  >
                    <XCircle className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">Click on a board to assign this user</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
