'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { School, User, CreditCard, AlertCircle, Calendar, Clock, Loader2 } from 'lucide-react';

interface TimeSlot {
  day: 'saturday' | 'sunday';
  label: string;
  time: string;
}

const TIME_SLOTS: TimeSlot[] = [
  { day: 'saturday', label: 'Saturday', time: '11:30 AM - 1:30 PM' },
  { day: 'sunday', label: 'Sunday', time: '2:30 PM - 4:30 PM' }
];

export default function RegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [userType, setUserType] = useState<'school' | 'non-school' | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    schoolName: '',
    schoolId: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [boardStats, setBoardStats] = useState<any[]>([]);

  useEffect(() => {
    if (step === 2) {
      fetchBoardStats();
    }
  }, [step]);

  const fetchBoardStats = async () => {
    try {
      const response = await fetch('/api/primetime/board-stats');
      const data = await response.json();
      
      if (response.ok) {
        setBoardStats(data.stats);
      }
    } catch (err) {
      console.error('Error fetching board stats:', err);
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userType) {
      setError('Please select user type');
      return;
    }
    setStep(2);
    setError('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getBoardCountForSlot = (day: string) => {
    if (!boardStats.length) return 0;
    
    const dayStats = boardStats.find((stat: any) => stat._id === day);
    if (!dayStats) return 0;
    
    return dayStats.boards.reduce((total: number, board: any) => 
      total + board.users, 0);
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
    setError('');
    
    if (!userType || !selectedSlot) {
      setError('Please select user type and time slot');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/primetime/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userType,
          selectedDay: selectedSlot.day,
          selectedTimeSlot: selectedSlot.time
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      if (userType === 'non-school') {
        router.push(`/primetime-competition/payment?userId=${data.userId}&slotDay=${selectedSlot.day}`);
      } else {
        // Directly allocate board for school students
        const allocationResponse = await fetch('/api/primetime/allocate-board', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: data.userId,
            day: selectedSlot.day
          })
        });

        const allocationData = await allocationResponse.json();

        if (!allocationResponse.ok) {
          throw new Error(allocationData.error || 'Board allocation failed');
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
        <h2 className="text-2xl font-bold text-brand-tealDark mb-6">
          Select Your Category
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <button
            type="button"
            onClick={() => setUserType('school')}
            className={`p-8 rounded-3xl border-2 transition-all ${userType === 'school' 
              ? 'border-brand-teal bg-brand-teal/5 shadow-md' 
              : 'border-gray-200 hover:border-brand-teal/50 hover:shadow-md'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${userType === 'school' ? 'bg-brand-teal' : 'bg-gray-100'}`}>
                <School className={`w-8 h-8 ${userType === 'school' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-bold text-brand-tealDark mb-2">
                School Student
              </h3>
              <p className="text-gray-600 text-center">
                Free registration with school ID card
              </p>
              {userType === 'school' && (
                <div className="mt-4 px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-semibold">
                  Selected
                </div>
              )}
            </div>
          </button>

          <button
            type="button"
            onClick={() => setUserType('non-school')}
            className={`p-8 rounded-3xl border-2 transition-all ${userType === 'non-school' 
              ? 'border-brand-coral bg-brand-coral/5 shadow-md' 
              : 'border-gray-200 hover:border-brand-coral/50 hover:shadow-md'}`}
          >
            <div className="flex flex-col items-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${userType === 'non-school' ? 'bg-brand-coral' : 'bg-gray-100'}`}>
                <CreditCard className={`w-8 h-8 ${userType === 'non-school' ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h3 className="text-xl font-bold text-brand-tealDark mb-2">
                Non-School Participant
              </h3>
              <p className="text-gray-600 text-center">
                ₹100 registration fee required
              </p>
              {userType === 'non-school' && (
                <div className="mt-4 px-4 py-2 bg-brand-coral/10 text-brand-coral rounded-full text-sm font-semibold">
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
          <h2 className="text-2xl font-bold text-brand-tealDark mb-6">
            Personal Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {userType === 'school' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Name *
                  </label>
                  <input
                    type="text"
                    name="schoolName"
                    value={formData.schoolName}
                    onChange={handleInputChange}
                    required={userType === 'school'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter school name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School ID Number *
                  </label>
                  <input
                    type="text"
                    name="schoolId"
                    value={formData.schoolId}
                    onChange={handleInputChange}
                    required={userType === 'school'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter school ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    School Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required={userType === 'school'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter school address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required={userType === 'school'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent"
                    placeholder="Enter city"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 px-8 rounded-full font-bold text-lg bg-brand-teal text-white hover:bg-brand-tealDark transition-all shadow-lg hover:shadow-xl"
          >
            Next: Select Time Slot
          </button>
        </form>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-brand-tealDark">
            Select Your Time Slot
          </h2>
          <p className="text-gray-600">
            Choose your preferred competition day and time
          </p>
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
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {TIME_SLOTS.map((slot) => (
          <button
            key={slot.day}
            type="button"
            onClick={() => setSelectedSlot(slot)}
            className={`p-6 rounded-3xl border-2 text-left transition-all ${selectedSlot?.day === slot.day
              ? 'border-brand-maroon bg-brand-maroon/5 shadow-md'
              : 'border-gray-200 hover:border-brand-maroon/50 hover:shadow-md'}`}
          >
            <div className="flex items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${selectedSlot?.day === slot.day ? 'bg-brand-maroon' : 'bg-gray-100'}`}>
                <Calendar className={`w-6 h-6 ${selectedSlot?.day === slot.day ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                  {slot.label}
                </h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Clock className="w-4 h-4 mr-2" />
                  {slot.time}
                </div>
                <div className="text-sm text-gray-500">
                  {getBoardCountForSlot(slot.day)} players registered
                </div>
                {selectedSlot?.day === slot.day && (
                  <div className="mt-3 inline-block px-3 py-1 bg-brand-maroon text-white rounded-full text-sm font-semibold">
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
        <div className="bg-brand-grayBg rounded-3xl p-6 mb-8">
          <h3 className="text-xl font-bold text-brand-tealDark mb-4">
            Board Availability for {selectedSlot.label}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }, (_, i) => i + 1).map((boardNum) => {
              const availability = getBoardAvailability(selectedSlot.day, boardNum);
              
              return (
                <div 
                  key={boardNum}
                  className={`p-4 rounded-2xl text-center ${availability.available 
                    ? 'bg-white border-2 border-green-200' 
                    : 'bg-gray-100 border-2 border-gray-300'}`}
                >
                  <div className="text-lg font-bold text-brand-tealDark mb-1">
                    Board {boardNum}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    {availability.users}/6
                  </div>
                  <div className={`text-xs font-semibold px-2 py-1 rounded-full ${availability.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'}`}>
                    {availability.available ? 'Available' : 'Full'}
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 text-sm text-gray-600">
            <p className="font-semibold mb-2">Board Allocation System:</p>
            <ul className="space-y-1">
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                Automatic load balancing across all boards
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                Maximum 100 players per board
              </li>
              <li className="flex items-start">
                <span className="text-brand-gold font-bold mr-2">•</span>
                You'll be assigned to the board with fewest players
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Important Notice for School Students */}
      {userType === 'school' && (
        <div className="mb-8 p-6 bg-yellow-50 border-2 border-brand-yellow rounded-2xl">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-brand-gold mr-3 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-brand-tealDark mb-2">
                Important Notice for School Students
              </h4>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  <span className="font-semibold">Must carry school ID card</span> for verification
                </li>
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  Only players allowed in playing area - No parents
                </li>
                <li className="flex items-start">
                  <span className="text-brand-gold font-bold mr-2">•</span>
                  Arrive 30 minutes before your scheduled time
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">
          {error}
        </div>
      )}

      <button
        onClick={handleFinalSubmit}
        disabled={loading || !selectedSlot}
        className={`w-full py-4 px-8 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl ${userType === 'school' 
          ? 'bg-brand-teal hover:bg-brand-tealDark' 
          : 'bg-brand-coral hover:bg-red-500'} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-3" />
            Processing...
          </div>
        ) : userType === 'school' ? (
          'Complete Registration (Free)'
        ) : (
          'Proceed to Payment (₹100)'
        )}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-400'}`}>
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-brand-teal' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-brand-teal text-white' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className={`${step >= 1 ? 'text-brand-teal' : 'text-gray-400'}`}>
              User Details
            </span>
            <span className={`${step >= 2 ? 'text-brand-teal' : 'text-gray-400'}`}>
              Time Slot
            </span>
          </div>
        </div>

        <div className="bg-white rounded-4xl shadow-soft p-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold font-heading text-brand-tealDark mb-4">
              Competition Registration
            </h1>
            <p className="text-gray-600">
              Step {step} of 2: {step === 1 ? 'User Information' : 'Time Slot Selection'}
            </p>
          </div>

          {step === 1 ? renderStep1() : renderStep2()}
        </div>
      </div>
    </div>
  );
}