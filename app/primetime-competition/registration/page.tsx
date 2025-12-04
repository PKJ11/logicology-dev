"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { School, User, CreditCard, AlertCircle, Calendar, Clock, Loader2 } from "lucide-react";

interface TimeSlot {
  day: "saturday" | "sunday";
  label: string;
  time: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { day: "saturday", label: "Saturday", time: "11:30 AM - 1:30 PM" },
  { day: "sunday", label: "Sunday", time: "2:30 PM - 4:30 PM" },
];

export default function RegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<"school" | "non-school" | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    schoolName: "",
    schoolId: "",
    address: "",
    city: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [boardStats, setBoardStats] = useState<any[]>([]);

  useEffect(() => {
    if (step === 2) {
      fetchBoardStats();
    }
  }, [step]);

  const fetchBoardStats = async () => {
    try {
      const response = await fetch("/api/primetime/board-stats");
      const data = await response.json();

      if (response.ok) {
        setBoardStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching board stats:", err);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      setError("Please select user type");
      return;
    }
    setStep(2);
    setError("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getBoardCountForSlot = (day: string) => {
    if (!boardStats.length) return 0;

    const dayStats = boardStats.find((stat: any) => stat._id === day);
    if (!dayStats) return 0;

    return dayStats.boards.reduce((total: number, board: any) => total + board.users, 0);
  };

  const getBoardAvailability = (day: string, boardNumber: number) => {
    if (!boardStats.length) return { users: 0, available: true };

    const dayStats = boardStats.find((stat: any) => stat._id === day);
    if (!dayStats) return { users: 0, available: true };

    const board = dayStats.boards.find((b: any) => b.boardNumber === boardNumber);
    const users = board ? board.users : 0;
    const available = users < 36; // Max 100 users per board

    return { users, available };
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userType || !selectedSlot) {
      setError("Please select user type and time slot");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/primetime/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userType,
          selectedDay: selectedSlot.day,
          selectedTimeSlot: selectedSlot.time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      if (userType === "non-school") {
        router.push(
          `/primetime-competition/payment?userId=${data.userId}&slotDay=${selectedSlot.day}`
        );
      } else {
        // Directly allocate board for school students
        const allocationResponse = await fetch("/api/primetime/allocate-board", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: data.userId,
            day: selectedSlot.day,
          }),
        });

        const allocationData = await allocationResponse.json();

        if (!allocationResponse.ok) {
          throw new Error(allocationData.error || "Board allocation failed");
        }

        router.push(`/primetime-competition/confirmation?userId=${data.userId}`);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStep1 = () => (
    <div>
      {/* User Type Selection */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold text-brand-tealDark">Select Your Category</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <button
            type="button"
            onClick={() => setUserType("school")}
            className={`rounded-3xl border-2 p-8 transition-all ${
              userType === "school"
                ? "border-brand-teal bg-brand-teal/5 shadow-md"
                : "border-gray-200 hover:border-brand-teal/50 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${userType === "school" ? "bg-brand-teal" : "bg-gray-100"}`}
              >
                <School
                  className={`h-8 w-8 ${userType === "school" ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-brand-tealDark">School Student</h3>
              <p className="text-center text-gray-600">Free registration with school ID card</p>
              {userType === "school" && (
                <div className="mt-4 rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-semibold text-brand-teal">
                  Selected
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUserType("non-school")}
            className={`rounded-3xl border-2 p-8 transition-all ${
              userType === "non-school"
                ? "border-brand-coral bg-brand-coral/5 shadow-md"
                : "border-gray-200 hover:border-brand-coral/50 hover:shadow-md"
            }`}
          >
            <div className="flex flex-col items-center">
              <div
                className={`mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${userType === "non-school" ? "bg-brand-coral" : "bg-gray-100"}`}
              >
                <CreditCard
                  className={`h-8 w-8 ${userType === "non-school" ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-brand-tealDark">Non-School Participant</h3>
              <p className="text-center text-gray-600">₹100 registration fee required</p>
              {userType === "non-school" && (
                <div className="mt-4 rounded-full bg-brand-coral/10 px-4 py-2 text-sm font-semibold text-brand-coral">
                  Selected
                </div>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Personal Information Form */}
      {userType && (
        <form onSubmit={handleStep1Submit}>
          <h2 className="mb-6 text-2xl font-bold text-brand-tealDark">Personal Information</h2>

          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                placeholder="Enter your phone number"
              />
            </div>

            {userType === "school" && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required={userType === "school"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    School ID Number *
                  </label>
                  <input
                    type="text"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    required={userType === "school"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                    placeholder="Enter school ID"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    School Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={userType === "school"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                    placeholder="Enter school address"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required={userType === "school"}
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-brand-teal"
                    placeholder="Enter city"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-brand-teal px-8 py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-brand-tealDark hover:shadow-xl"
          >
            Next: Select Time Slot
          </button>
        </form>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-brand-tealDark">Select Your Time Slot</h2>
          <p className="text-gray-600">Choose your preferred competition day and time</p>
        </div>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-brand-teal hover:text-brand-tealDark"
        >
          ← Back
        </button>
      </div>

      {/* Time Slot Selection */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.day}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            className={`rounded-3xl border-2 p-6 text-left transition-all ${
              selectedSlot?.day === slot.day
                ? "border-brand-maroon bg-brand-maroon/5 shadow-md"
                : "border-gray-200 hover:border-brand-maroon/50 hover:shadow-md"
            }`}
          >
            <div className="flex items-start">
              <div
                className={`mr-4 flex h-12 w-12 items-center justify-center rounded-xl ${selectedSlot?.day === slot.day ? "bg-brand-maroon" : "bg-gray-100"}`}
              >
                <Calendar
                  className={`h-6 w-6 ${selectedSlot?.day === slot.day ? "text-white" : "text-gray-400"}`}
                />
              </div>
              <div>
                <h3 className="mb-1 text-xl font-bold text-brand-tealDark">{slot.label}</h3>
                <div className="mb-2 flex items-center text-gray-600">
                  <Clock className="mr-2 h-4 w-4" />
                  {slot.time}
                </div>
                <div className="text-sm text-gray-500">
                  {getBoardCountForSlot(slot.day)} players registered
                </div>
                {selectedSlot?.day === slot.day && (
                  <div className="mt-3 inline-block rounded-full bg-brand-maroon px-3 py-1 text-sm font-semibold text-white">
                    Selected
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Board Availability Preview */}
      {selectedSlot && (
        <div className="mb-8 rounded-3xl bg-brand-grayBg p-6">
          <h3 className="mb-4 text-xl font-bold text-brand-tealDark">
            Board Availability for {selectedSlot.label}
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((boardNum) => {
              const availability = getBoardAvailability(selectedSlot.day, boardNum);

              return (
                <div
                  key={boardNum}
                  className={`rounded-2xl p-4 text-center ${
                    availability.available
                      ? "border-2 border-green-200 bg-white"
                      : "border-2 border-gray-300 bg-gray-100"
                  }`}
                >
                  <div className="mb-1 text-lg font-bold text-brand-tealDark">Board {boardNum}</div>
                  <div className="mb-2 text-sm text-gray-600">{availability.users}/6</div>
                  <div
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      availability.available
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {availability.available ? "Available" : "Full"}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 text-sm text-gray-600">
            <p className="mb-2 font-semibold">Board Allocation System:</p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                Automatic load balancing across all boards
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                Maximum 100 players per board
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Important Notice for School Students */}
      {userType === "school" && (
        <div className="mb-8 rounded-2xl border-2 border-brand-yellow bg-yellow-50 p-6">
          <div className="flex items-start">
            <AlertCircle className="mr-3 mt-0.5 h-6 w-6 flex-shrink-0 text-brand-gold" />
            <div>
              <h4 className="mb-2 font-bold text-brand-tealDark">
                Important Notice for School Students
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-brand-gold">•</span>
                  <span className="font-semibold">Must carry school ID card</span> for verification
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-brand-gold">•</span>
                  Only players allowed in playing area - No parents
                </li>
                <li className="flex items-start">
                  <span className="mr-2 font-bold text-brand-gold">•</span>
                  Arrive 30 minutes before your scheduled time
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

      <button
        onClick={handleFinalSubmit}
        disabled={loading || !selectedSlot}
        className={`w-full rounded-full px-8 py-4 text-lg font-bold shadow-lg transition-all hover:shadow-xl ${
          userType === "school"
            ? "bg-brand-teal hover:bg-brand-tealDark"
            : "bg-brand-coral hover:bg-red-500"
        } text-white disabled:cursor-not-allowed disabled:opacity-50`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
            Processing...
          </div>
        ) : userType === "school" ? (
          "Complete Registration (Free)"
        ) : (
          "Proceed to Payment (₹100)"
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="mb-4 flex items-center justify-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 1 ? "bg-brand-teal text-white" : "bg-gray-200 text-gray-400"}`}
            >
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? "bg-brand-teal" : "bg-gray-200"}`}></div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${step >= 2 ? "bg-brand-teal text-white" : "bg-gray-200 text-gray-400"}`}
            >
              2
            </div>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={`${step >= 1 ? "text-brand-teal" : "text-gray-400"}`}>
              User Details
            </span>
            <span className={`${step >= 2 ? "text-brand-teal" : "text-gray-400"}`}>Time Slot</span>
          </div>
        </div>

        <div className="rounded-4xl bg-white p-8 shadow-soft">
          <div className="mb-10 text-center">
            <h1 className="mb-4 font-heading text-4xl font-bold text-brand-tealDark">
              Competition Registration
            </h1>
            <p className="text-gray-600">
              Step {step} of 2: {step === 1 ? "User Information" : "Time Slot Selection"}
            </p>
          </div>

          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
}
