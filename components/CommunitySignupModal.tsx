"use client";

import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCAnSPFmz-3ZrXrRcIR8Thdm6CTpbXgbZg",
  authDomain: "gmc2025-6a9bc.firebaseapp.com",
  projectId: "gmc2025-6a9bc",
  storageBucket: "gmc2025-6a9bc.firebasestorage.app",
  messagingSenderId: "974661554138",
  appId: "1:974661554138:web:028277d1bfe9a609ed3ae3",
  measurementId: "G-FSHD9Q8QBY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

declare global {
  interface Window {
    recaptchaVerifierRenderId?: number;
  }
}

interface CommunitySignupModalProps {
  open: boolean;
  onClose: () => void;
  onNavigateToCommunity?: () => void;
}

interface ApiError {
  msg: string;
  param?: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

// Utility function to check if JWT token is valid
const hasValidToken = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const token = localStorage.getItem("communityToken");
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    console.error("Error checking token validity:", error);
    return false;
  }
};

// Utility function to get user data from storage
const getUserData = (): UserData | null => {
  if (typeof window === "undefined") return null;
  
  const userData = localStorage.getItem("userData");
  if (!userData) return null;
  
  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export default function CommunitySignupModal({
  open,
  onClose,
  onNavigateToCommunity,
}: CommunitySignupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [hasExistingSession, setHasExistingSession] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recaptchaVerifier = useRef<RecaptchaVerifier | null>(null);

  // Check for existing session when modal opens
  useEffect(() => {
    if (open) {
      const sessionExists = hasValidToken();
      setHasExistingSession(sessionExists);
      if (sessionExists) {
        setUserData(getUserData());
      }
      setErrorMessage(null);
    }
  }, [open]);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (!open) return;

    try {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }

      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA solved"),
          "expired-callback": () => {
            console.log("reCAPTCHA expired");
            resetRecaptcha();
          },
        }
      );

      return () => {
        if (recaptchaVerifier.current) {
          try {
            recaptchaVerifier.current.clear();
          } catch (error) {
            console.log("Error during reCAPTCHA cleanup:", error);
          }
        }
      };
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      setErrorMessage("Failed to initialize security verification. Please refresh the page.");
    }
  }, [open]);

  const resetRecaptcha = () => {
    try {
      if (recaptchaVerifier.current) {
        recaptchaVerifier.current.clear();
      }

      recaptchaVerifier.current = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => console.log("reCAPTCHA solved"),
          "expired-callback": resetRecaptcha,
        }
      );
    } catch (error) {
      console.error("Error resetting reCAPTCHA:", error);
      setErrorMessage("Failed to reset security verification. Please refresh the page.");
    }
  };

  const handleSendOtp = async () => {
    if (!phone || phone.length < 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      const formattedPhone = `+91${phone}`;

      if (!recaptchaVerifier.current) {
        throw new Error("reCAPTCHA not initialized");
      }

      const result = await signInWithPhoneNumber(
        auth,
        formattedPhone,
        recaptchaVerifier.current
      );

      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error: any) {
      console.error("Error sending OTP:", error);
      setErrorMessage(`Failed to send OTP: ${error.message || "Unknown error"}`);
      resetRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      return;
    }

    if (!confirmationResult) {
      setErrorMessage("OTP verification not initialized. Please try sending the OTP again.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      await confirmationResult.confirm(otp);
      setOtpVerified(true);
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setErrorMessage(`Invalid OTP: ${error.message || "Please check the code and try again"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpVerified) {
      setErrorMessage("Please verify your phone number first");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Real API call to register user
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password: "defaultPassword", // In a real app, you might want to generate a random password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessage = data.errors
            .map((err: ApiError) => err.msg)
            .join(", ");
          throw new Error(errorMessage);
        }
        throw new Error(data.message || "Registration failed");
      }

      // Store the token and user data
      if (data.token) {
        localStorage.setItem("communityToken", data.token);
        
        // Store user data if available in response
        if (data.user) {
          localStorage.setItem("userData", JSON.stringify(data.user));
          setUserData(data.user);
        } else {
          // Create user data from form inputs if not provided by API
          const userData = { id: Date.now().toString(), name, email, phone };
          localStorage.setItem("userData", JSON.stringify(userData));
          setUserData(userData);
        }
      }

      setRegistrationSuccess(true);
      setHasExistingSession(true);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      setErrorMessage(`Registration failed: ${error.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToCommunity = () => {
    resetForm();
    onClose();
    if (onNavigateToCommunity) {
      onNavigateToCommunity();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("communityToken");
    localStorage.removeItem("userData");
    setHasExistingSession(false);
    setUserData(null);
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setOtp("");
    setOtpSent(false);
    setOtpVerified(false);
    setConfirmationResult(null);
    setRegistrationSuccess(false);
    setErrorMessage(null);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
  <div className="bg-white rounded-2xl shadow-brand max-w-md w-full p-8 relative max-h-[90vh] overflow-y-auto">
    <button
      onClick={() => {
        resetForm();
        onClose();
      }}
      className="absolute top-6 right-6 text-brand-tealDark hover:text-brand-coral text-2xl transition-colors"
    >
      &times;
    </button>

    <div className="text-center mb-8">
      <h2 className="text-3xl font-bold text-brand-tealDark">
        {hasExistingSession 
          ? "Welcome Back!" 
          : registrationSuccess 
            ? "Welcome to Our Community!" 
            : "Join Our Community"
        }
      </h2>
      <div className="w-20 h-1 bg-brand-gold mx-auto mt-3 rounded-full"></div>
    </div>

    {errorMessage && (
      <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {errorMessage}
        </div>
      </div>
    )}

    {hasExistingSession ? (
      <div className="text-center py-4">
        <div className="w-24 h-24 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl text-brand-teal font-semibold">
            {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-brand-tealDark mb-3">
          {userData?.name || 'User'}
        </h3>
        <p className="text-brand-tealDark/80 mb-3">{userData?.email}</p>
        <p className="text-brand-tealDark/80 mb-8">{userData?.phone}</p>
        
        <div className="flex flex-col gap-4">
          <button
            onClick={handleGoToCommunity}
            className="w-full py-3 px-6 bg-brand-teal text-white font-medium rounded-xl hover:bg-brand-tealDark transition-colors shadow-md"
          >
            Go to Community
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-6 border border-brand-teal/30 text-brand-teal font-medium rounded-xl hover:bg-brand-teal/5 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    ) : registrationSuccess ? (
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-brand-tealDark mb-3">Success!</h3>
        <p className="text-brand-tealDark/80 mb-8">
          Your account has been created successfully. You're now part of our community.
        </p>
        <button
          onClick={handleGoToCommunity}
          className="w-full py-3 px-6 bg-brand-teal text-white font-medium rounded-xl hover:bg-brand-tealDark transition-colors shadow-md"
        >
          Go to Community
        </button>
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-brand-tealDark mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 border border-brand-teal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
            placeholder="Enter your full name"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-tealDark mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-brand-teal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
            placeholder="Enter your email"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-brand-tealDark mb-2">
            Mobile Number *
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <span className="text-brand-tealDark/60">+91</span>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                required
                disabled={otpSent || loading}
                maxLength={10}
                className="w-full pl-12 px-4 py-3 border border-brand-teal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all disabled:bg-brand-grayBg"
                placeholder="10-digit number"
              />
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={otpSent || !phone || phone.length < 10 || loading}
              className="px-5 py-3 bg-brand-teal text-white rounded-xl hover:bg-brand-tealDark disabled:bg-brand-teal/40 disabled:cursor-not-allowed transition-colors whitespace-nowrap shadow-md"
            >
              {loading ? "Sending..." : otpSent ? "Sent" : "Send OTP"}
            </button>
          </div>
        </div>

        {otpSent && (
          <div>
            <label className="block text-sm font-medium text-brand-tealDark mb-2">
              Enter OTP *
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="6-digit OTP"
                maxLength={6}
                className="flex-1 px-4 py-3 border border-brand-teal/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-teal/50 focus:border-brand-teal transition-all"
                disabled={loading || otpVerified}
              />
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpVerified || !otp || otp.length !== 6 || loading}
                className={`px-5 py-3 rounded-xl transition-colors shadow-md ${
                  otpVerified
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-brand-teal text-white hover:bg-brand-tealDark"
                } disabled:bg-brand-teal/40 disabled:cursor-not-allowed whitespace-nowrap`}
              >
                {loading ? "Verifying..." : otpVerified ? "Verified" : "Verify"}
              </button>
            </div>
          </div>
        )}

        <div id="recaptcha-container"></div>

        <button
          type="submit"
          disabled={!otpVerified || loading}
          className="w-full py-3 px-6 bg-brand-teal text-white font-medium rounded-xl hover:bg-brand-tealDark disabled:bg-brand-teal/40 disabled:cursor-not-allowed transition-colors shadow-md"
        >
          {loading ? "Processing..." : "Join Community"}
        </button>

        <p className="text-xs text-brand-tealDark/60 text-center mt-6">
          By joining, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    )}
  </div>
</div>
  );
}