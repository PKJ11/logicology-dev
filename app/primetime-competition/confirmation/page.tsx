'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Calendar, Clock, Users, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { FaChessBoard } from 'react-icons/fa';

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [error, setError] = useState('');

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
        throw new Error(data.error || 'Failed to fetch user details');
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal"></div>
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">Error: {error || 'User not found'}</div>
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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-4xl shadow-soft p-8">
          <div className="text-center mb-10">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold font-heading text-brand-tealDark mb-4">
              Registration Complete!
            </h1>
            <p className="text-gray-600">
              Your competition slot has been confirmed. Save these details.
            </p>
          </div>

          {/* User Information */}
          <div className="bg-brand-grayBg rounded-3xl p-6 mb-8">
            <h3 className="text-xl font-bold text-brand-tealDark mb-4">
              Registration Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                <span className="font-semibold">Name</span>
                <span className="font-bold">{userDetails.name}</span>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                <span className="font-semibold">Email</span>
                <span className="font-bold">{userDetails.email}</span>
              </div>
              
              {userDetails.userType === 'school' && (
                <>
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                    <span className="font-semibold">School</span>
                    <span className="font-bold">{userDetails.schoolDetails?.schoolName}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-4 bg-white rounded-2xl">
                    <span className="font-semibold">School ID</span>
                    <span className="font-bold">{userDetails.schoolDetails?.schoolId}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Competition Slot Details */}
          <div className="bg-brand-teal/5 rounded-3xl p-8 mb-8">
            <h3 className="text-2xl font-bold text-brand-tealDark mb-6">
              Competition Slot Details
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                <div className="flex items-center">
                  <Calendar className="w-6 h-6 text-brand-teal mr-3" />
                  <span className="font-semibold">Day</span>
                </div>
                <span className="text-xl font-bold text-brand-tealDark capitalize">
                  {userDetails.competitionSlot?.day || userDetails.selectedSlot?.day}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                <div className="flex items-center">
                  <Clock className="w-6 h-6 text-brand-teal mr-3" />
                  <span className="font-semibold">Time Slot</span>
                </div>
                <span className="text-xl font-bold text-brand-tealDark">
                  {userDetails.competitionSlot?.timeSlot || userDetails.selectedSlot?.timeSlot}
                </span>
              </div>
              
              {userDetails.competitionSlot && (
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <FaChessBoard className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Board Number</span>
                  </div>
                  <span className="text-3xl font-bold text-brand-coral">
                    Board {userDetails.competitionSlot.boardNumber}
                  </span>
                </div>
              )}
              
              {userDetails.competitionSlot?.slotTime && (
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Reporting Time</span>
                  </div>
                  <span className="text-lg font-bold text-brand-tealDark">
                    {new Date(userDetails.competitionSlot.slotTime).toLocaleDateString('en-IN', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Important Instructions */}
          <div className="p-6 bg-yellow-50 border-2 border-brand-yellow rounded-2xl mb-8">
            <h4 className="font-bold text-brand-tealDark mb-4 flex items-center">
              <AlertCircle className="w-6 h-6 text-brand-gold mr-3" />
              Important Instructions
            </h4>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                <span className="font-semibold">Arrive 30 minutes before your scheduled time</span>
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                {userDetails.userType === 'school' ? (
                  <span><span className="font-semibold">Must carry school ID card</span> for verification</span>
                ) : (
                  <span>Bring your <span className="font-semibold">registration confirmation</span> (this page)</span>
                )}
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                <span className="font-semibold">Only players are allowed</span> in the playing area - No parents/guardians
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                Report directly to your assigned board number
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                Chess equipment will be provided at the venue
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => window.print()}
              className="flex-1 py-4 bg-white border-2 border-brand-teal text-brand-teal rounded-full font-bold text-lg hover:bg-brand-teal/5 transition-all"
            >
              Print Details
            </button>
            
            <Link
              href="/primetime-competition"
              className="flex-1 py-4 bg-brand-maroon text-white rounded-full font-bold text-lg hover:bg-brand-maroonDark transition-all text-center"
            >
              Back to Competition Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}