"use client";

import { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  RecaptchaVerifier, 
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAnSPFmz-3ZrXrRcIR8Thdm6CTpbXgbZg",
  authDomain: "gmc2025-6a9bc.firebaseapp.com",
  projectId: "gmc2025-6a9bc",
  storageBucket: "gmc2025-6a9bc.firebasestorage.app",
  messagingSenderId: "974661554138",
  appId: "1:974661554138:web:028277d1bfe9a609ed3ae3",
  measurementId: "G-FSHD9Q8QBY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Extend Window interface to include recaptchaVerifierRenderId if needed
declare global {
  interface Window {
    recaptchaVerifierRenderId?: number;
  }
}

interface CommunitySignupModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CommunitySignupModal({ open, onClose }: CommunitySignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  // Initialize and clean up reCAPTCHA
  useEffect(() => {
    if (!open) return;

    const initializeRecaptcha = () => {
      try {
        // Clear any existing reCAPTCHA
        if (recaptchaVerifier.current) {
          try {
            recaptchaVerifier.current.clear();
          } catch (clearError) {
            console.log('Error clearing old reCAPTCHA:', clearError);
          }
        }

        // Initialize new reCAPTCHA
        recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => console.log('reCAPTCHA solved'),
          'expired-callback': () => {
            console.log('reCAPTCHA expired');
            resetRecaptcha();
          }
        });

        return () => {
          // Cleanup on unmount or when modal closes
          if (recaptchaVerifier.current) {
            try {
              recaptchaVerifier.current.clear();
            } catch (error) {
              console.log('Error during reCAPTCHA cleanup:', error);
            }
            recaptchaVerifier.current = null;
          }
        };
      } catch (error) {
        console.error('Error initializing reCAPTCHA:', error);
        return undefined;
      }
    };

    const cleanup = initializeRecaptcha();
    return cleanup;
  }, [open]);

  const resetRecaptcha = () => {
    try {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }
      
      recaptchaVerifier.current = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => console.log('reCAPTCHA solved'),
        'expired-callback': resetRecaptcha
      });
    } catch (error) {
      console.error('Error resetting reCAPTCHA:', error);
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      setLoading(true);
      const formattedPhone = `+91${phone}`;
      
      if (!recaptchaVerifier.current) {
        throw new Error('reCAPTCHA not initialized');
      }

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.current
      );

      setConfirmationResult(result);
      setOtpSent(true);
      alert(`OTP sent to ${phone}`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      alert(`Failed to send OTP: ${error instanceof Error ? error.message : 'Unknown error'}`);
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      alert('Please enter a valid 6-digit OTP');
      return;
    }

    if (!confirmationResult) {
      alert('OTP verification not initialized');
      return;
    }

    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
      alert('Phone number verified successfully!');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      alert(`Invalid OTP: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpVerified) {
      alert('Please verify your phone number first');
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: 'defaultPassword'
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          const errorMessage = data.errors.map((err: any) => err.msg).join(', ');
          throw new Error(errorMessage);
        }
        throw new Error(data.message || 'Registration failed');
      }

      alert('Registration successful! Welcome to our community!');
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setConfirmationResult(null);
    
    // Reset reCAPTCHA when form is reset
    if (recaptchaVerifier.current) {
      try {
        recaptchaVerifier.current.clear();
      } catch (error) {
        console.log('Error clearing reCAPTCHA on form reset:', error);
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Join Our Community</h2>
          <button 
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex gap-2">
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                required
                disabled={otpSent}
                maxLength={10}
                placeholder="10-digit number"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={otpSent || !phone || phone.length < 10 || loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {otpSent ? 'Sent' : 'Send OTP'}
              </button>
            </div>
          </div>

          {otpSent && (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <div className="flex gap-2">
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="6-digit OTP"
                  maxLength={6}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={otpVerified || !otp || otp.length !== 6 || loading}
                  className={`px-4 py-2 rounded-md ${otpVerified ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'} disabled:bg-gray-300 disabled:cursor-not-allowed`}
                >
                  {otpVerified ? 'Verified' : 'Verify'}
                </button>
              </div>
            </div>
          )}

          {/* Hidden reCAPTCHA container */}
          <div id="recaptcha-container"></div>

          <button
            type="submit"
            disabled={!otpVerified || loading}
            className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : 'Join Community'}
          </button>
        </form>
      </div>
    </div>
  );
}