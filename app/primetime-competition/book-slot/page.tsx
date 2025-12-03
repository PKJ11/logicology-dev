'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Calendar, Clock,  Users, CheckCircle } from 'lucide-react';
import { FaChessBoard } from 'react-icons/fa';

interface BoardStats {
  boardNumber: number;
  currentUsers: number;
  maxUsers: number;
  percentage: number;
}

export default function BookSlotPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  
  const [selectedDay, setSelectedDay] = useState<'saturday' | 'sunday'>('saturday');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boardStats, setBoardStats] = useState<BoardStats[]>([]);
  const [slotBooked, setSlotBooked] = useState(false);
  const [userSlot, setUserSlot] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchBoardStats();
      checkExistingSlot();
    }
  }, [userId, selectedDay]);

  const fetchBoardStats = async () => {
    try {
      const response = await fetch(`/api/primetime/board-stats?day=${selectedDay}`);
      const data = await response.json();
      
      if (response.ok) {
        setBoardStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching board stats:', err);
    }
  };

  const checkExistingSlot = async () => {
    try {
      const response = await fetch(`/api/primetime/user-slot?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.slot) {
        setSlotBooked(true);
        setUserSlot(data.slot);
      }
    } catch (err) {
      console.error('Error checking slot:', err);
    }
  };

  const handleBookSlot = async () => {
    if (!userId) {
      setError('User ID not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/primetime/book-slot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          day: selectedDay
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book slot');
      }

      setSlotBooked(true);
      setUserSlot(data.slot);
      fetchBoardStats(); // Refresh stats
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (slotBooked && userSlot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-4xl shadow-soft p-8 text-center">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            
            <h1 className="text-4xl font-bold font-heading text-brand-tealDark mb-6">
              Slot Booked Successfully!
            </h1>
            
            <div className="bg-brand-teal/5 rounded-3xl p-8 mb-8">
              <h3 className="text-2xl font-bold text-brand-tealDark mb-6">
                Your Competition Details
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <Calendar className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Day</span>
                  </div>
                  <span className="text-xl font-bold text-brand-tealDark capitalize">
                    {userSlot.day}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <Clock className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Time Slot</span>
                  </div>
                  <span className="text-xl font-bold text-brand-tealDark">
                    {userSlot.timeSlot}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <FaChessBoard className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Board Number</span>
                  </div>
                  <span className="text-3xl font-bold text-brand-coral">
                    Board {userSlot.boardNumber}
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl">
                  <div className="flex items-center">
                    <Users className="w-6 h-6 text-brand-teal mr-3" />
                    <span className="font-semibold">Slot Time</span>
                  </div>
                  <span className="text-xl font-bold text-brand-tealDark">
                    {new Date(userSlot.slotTime).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-yellow-50 border-2 border-brand-yellow rounded-2xl text-left">
              <h4 className="font-bold text-brand-tealDark mb-3">
                Important Instructions:
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  Arrive 30 minutes before your slot time
                </li>
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  School students must bring valid ID card
                </li>
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  Only players allowed in the playing area
                </li>
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  Report to Board {userSlot.boardNumber} directly
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-heading text-brand-tealDark mb-4">
            Book Your Competition Slot
          </h1>
          <p className="text-xl text-gray-600">
            Choose your preferred day and secure a balanced board allocation
          </p>
        </div>

        {/* Day Selection */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <button
            onClick={() => setSelectedDay('saturday')}
            className={`p-8 rounded-4xl border-4 transition-all ${selectedDay === 'saturday' 
              ? 'border-brand-teal bg-brand-teal/5 shadow-brand' 
              : 'border-gray-200 bg-white hover:border-brand-teal/50 hover:shadow-md'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${selectedDay === 'saturday' ? 'bg-brand-teal' : 'bg-gray-100'}`}>
                <Calendar className={`w-10 h-10 ${selectedDay === 'saturday' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-2xl font-bold text-brand-tealDark mb-3">
                Saturday
              </h3>
              <div className="text-lg font-semibold text-gray-600 mb-2">
                11:30 AM - 1:30 PM
              </div>
              {selectedDay === 'saturday' && (
                <div className="px-6 py-2 bg-brand-teal text-white rounded-full font-semibold">
                  Selected
                </div>
              )}
            </div>
          </button>

          <button
            onClick={() => setSelectedDay('sunday')}
            className={`p-8 rounded-4xl border-4 transition-all ${selectedDay === 'sunday' 
              ? 'border-brand-coral bg-brand-coral/5 shadow-brand' 
              : 'border-gray-200 bg-white hover:border-brand-coral/50 hover:shadow-md'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 ${selectedDay === 'sunday' ? 'bg-brand-coral' : 'bg-gray-100'}`}>
                <Clock className={`w-10 h-10 ${selectedDay === 'sunday' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-2xl font-bold text-brand-tealDark mb-3">
                Sunday
              </h3>
              <div className="text-lg font-semibold text-gray-600 mb-2">
                2:30 PM - 4:30 PM
              </div>
              {selectedDay === 'sunday' && (
                <div className="px-6 py-2 bg-brand-coral text-white rounded-full font-semibold">
                  Selected
                </div>
              )}
            </div>
          </button>
        </div>

        {/* Board Statistics */}
        <div className="bg-white rounded-4xl shadow-soft p-8 mb-8">
          <h3 className="text-2xl font-bold text-brand-tealDark mb-8 text-center">
            Board Allocation - {selectedDay.charAt(0).toUpperCase() + selectedDay.slice(1)}
          </h3>
          
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {Array.from({ length: 6 }, (_, i) => i + 1).map(boardNum => {
              const boardStat = boardStats.find(s => s.boardNumber === boardNum);
              const users = boardStat?.currentUsers || 0;
              const maxUsers = boardStat?.maxUsers || 100;
              const percentage = (users / maxUsers) * 100;
              
              return (
                <div key={boardNum} className="bg-brand-grayBg rounded-3xl p-6 text-center">
                  <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <FaChessBoard className="w-8 h-8 text-brand-teal" />
                  </div>
                  <h4 className="text-xl font-bold text-brand-tealDark mb-3">
                    Board {boardNum}
                  </h4>
                  
                  <div className="mb-3">
                    <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-brand-teal transition-all"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 mt-2">
                      <span>{users} users</span>
                      <span>{maxUsers} max</span>
                    </div>
                  </div>
                  
                  <div className="text-sm">
                    <div className="flex items-center justify-center text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      <span>{users} registered</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 border-2 border-brand-yellow rounded-2xl">
            <h4 className="font-bold text-brand-tealDark mb-3">
              Board Allocation System
            </h4>
            <p className="text-gray-700">
              Our system automatically balances users across all 6 boards. 
              When you book a slot, you'll be assigned to the board with the fewest participants 
              to ensure fair distribution and optimal playing experience.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <button
          onClick={handleBookSlot}
          disabled={loading}
          className="w-full py-4 bg-brand-maroon text-white rounded-full font-bold text-lg hover:bg-brand-maroonDark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking Your Slot...' : `Book ${selectedDay} Slot`}
        </button>
      </div>
    </div>
  );
}