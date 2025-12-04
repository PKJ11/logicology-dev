"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Calendar, Clock, Users, AlertCircle } from "lucide-react";
import Link from "next/link";
import { FaChessBoard } from "react-icons/fa";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/primetime/user-details?userId=${userId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch user details");
      }

      setUserDetails(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-xl text-red-500">Error: {error || "User not found"}</div>
          <Link
            href="/primetime-competition/registration"
            className="text-brand-teal hover:underline"
          >
            Back to Registration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="rounded-4xl bg-white p-8 shadow-soft">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="mb-4 font-heading text-4xl font-bold text-brand-tealDark">
              Registration Complete!
            </h1>
            <p className="text-gray-600">
              Your competition slot has been confirmed. Save these details.
            </p>
          </div>

          {/* User Information */}
          <div className="mb-8 rounded-3xl bg-brand-grayBg p-6">
            <h3 className="mb-4 text-xl font-bold text-brand-tealDark">Registration Details</h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                <span className="font-semibold">Name</span>
                <span className="font-bold">{userDetails.name}</span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                <span className="font-semibold">Email</span>
                <span className="font-bold">{userDetails.email}</span>
              </div>

              {userDetails.userType === "school" && (
                <>
                  <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                    <span className="font-semibold">School</span>
                    <span className="font-bold">{userDetails.schoolDetails?.schoolName}</span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                    <span className="font-semibold">School ID</span>
                    <span className="font-bold">{userDetails.schoolDetails?.schoolId}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Competition Slot Details */}
          <div className="mb-8 rounded-3xl bg-brand-teal/5 p-8">
            <h3 className="mb-6 text-2xl font-bold text-brand-tealDark">
              Competition Slot Details
            </h3>

            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                <div className="flex items-center">
                  <Calendar className="mr-3 h-6 w-6 text-brand-teal" />
                  <span className="font-semibold">Day</span>
                </div>
                <span className="text-xl font-bold capitalize text-brand-tealDark">
                  {userDetails.competitionSlot?.day || userDetails.selectedSlot?.day}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                <div className="flex items-center">
                  <Clock className="mr-3 h-6 w-6 text-brand-teal" />
                  <span className="font-semibold">Time Slot</span>
                </div>
                <span className="text-xl font-bold text-brand-tealDark">
                  {userDetails.competitionSlot?.timeSlot || userDetails.selectedSlot?.timeSlot}
                </span>
              </div>

              {/* {userDetails.competitionSlot && (
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <FaChessBoard className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Board Number</span>
                  </div>
                  <span className="text-3xl font-bold text-brand-coral">
                    Board {userDetails.competitionSlot.boardNumber}
                  </span>
                </div>
              )} */}

              {userDetails.competitionSlot?.slotTime && (
                <div className="flex items-center justify-between rounded-2xl bg-white p-4">
                  <div className="flex items-center">
                    <Users className="mr-3 h-6 w-6 text-brand-teal" />
                    <span className="font-semibold">Reporting Time</span>
                  </div>
                  <span className="text-lg font-bold text-brand-tealDark">
                    {new Date(userDetails.competitionSlot.slotTime).toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Important Instructions */}
          <div className="mb-8 rounded-2xl border-2 border-brand-yellow bg-yellow-50 p-6">
            <h4 className="mb-4 flex items-center font-bold text-brand-tealDark">
              <AlertCircle className="mr-3 h-6 w-6 text-brand-gold" />
              Important Instructions
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                <span className="font-semibold">Arrive 30 minutes before your scheduled time</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                {userDetails.userType === "school" ? (
                  <span>
                    <span className="font-semibold">Must carry school ID card</span> for
                    verification
                  </span>
                ) : (
                  <span>
                    Bring your <span className="font-semibold">registration confirmation</span>{" "}
                    (this page)
                  </span>
                )}
              </li>
              <li className="flex items-start">
                <span className="mr-2 font-bold text-brand-gold">•</span>
                <span className="font-semibold">Only players are allowed</span> in the playing area
                - No parents/guardians
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-full border-2 border-brand-teal bg-white py-4 text-lg font-bold text-brand-teal transition-all hover:bg-brand-teal/5"
            >
              Print Details
            </button>

            <Link
              href="/primetime-competition"
              className="flex-1 rounded-full bg-brand-maroon py-4 text-center text-lg font-bold text-white transition-all hover:bg-brand-maroonDark"
            >
              Back to Competition Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
