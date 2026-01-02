"use client";

import { useState, useEffect, useRef } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";
import { useRouter } from "next/navigation";

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

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: UserData;
  message?: string;
}

// Utility function to check if JWT token is valid
const hasValidToken = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = localStorage.getItem("communityToken");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
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

type TabType = "signup" | "login";

export default function CommunitySignupModal({
  open,
  onClose,
  onNavigateToCommunity,
}: CommunitySignupModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("signup");
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
  const recaptchaInitialized = useRef(false);
  const needsRecaptcha = useRef(false); // Track if reCAPTCHA is needed
  const router = useRouter();

  // Check for existing session when modal opens
  useEffect(() => {
    if (open) {
      const sessionExists = hasValidToken();
      setHasExistingSession(sessionExists);
      if (sessionExists) {
        setUserData(getUserData());
      }
      setErrorMessage(null);

      // Only need reCAPTCHA for signup tab
      needsRecaptcha.current = activeTab === "signup";
    }
  }, [open, activeTab]);

  // Reset form when switching tabs
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [activeTab, open]);

  // Initialize reCAPTCHA only when needed (signup tab and OTP not sent yet)
  useEffect(() => {
    if (!open) return;

    // Only initialize reCAPTCHA for signup tab and when OTP is not sent
    if (activeTab === "signup" && !otpSent && needsRecaptcha.current) {
      initializeRecaptcha();
    } else {
      // Clean up reCAPTCHA if not needed
      cleanupRecaptcha();
    }

    // Cleanup function
    return () => {
      cleanupRecaptcha();
    };
  }, [open, activeTab, otpSent]);

  const initializeRecaptcha = () => {
    try {
      // First, clean up any existing reCAPTCHA
      cleanupRecaptcha();

      // Wait a bit for DOM to be ready
      setTimeout(() => {
        try {
          // Check if container exists
          const container = document.getElementById("recaptcha-container");
          if (!container) {
            console.log("reCAPTCHA container not found");
            return;
          }

          // Initialize new reCAPTCHA
          recaptchaVerifier.current = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: () => {
              console.log("reCAPTCHA solved");
            },
            "expired-callback": () => {
              console.log("reCAPTCHA expired");
              // Don't try to reinitialize on expired, just mark as not initialized
              recaptchaInitialized.current = false;
            },
          });

          recaptchaInitialized.current = true;
          needsRecaptcha.current = true;
          setErrorMessage(null);
          console.log("reCAPTCHA initialized successfully");
        } catch (innerError) {
          console.error("Error in delayed reCAPTCHA initialization:", innerError);
          recaptchaInitialized.current = false;
        }
      }, 300);
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error);
      // Don't show error to user for reCAPTCHA initialization issues
      recaptchaInitialized.current = false;
    }
  };

  const cleanupRecaptcha = () => {
    if (recaptchaVerifier.current) {
      try {
        recaptchaVerifier.current.clear();
      } catch (error) {
        console.log("Error during reCAPTCHA cleanup:", error);
      }
      recaptchaVerifier.current = null;
    }
    recaptchaInitialized.current = false;
    needsRecaptcha.current = false;

    // Clear container
    const container = document.getElementById("recaptcha-container");
    if (container) {
      container.innerHTML = "";
    }
  };

  // Check if user exists in database
  const checkExistingMember = async (phoneNumber: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/check-community-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      const data = await response.json();
      return data.exists || false;
    } catch (error) {
      console.error("Error checking existing member:", error);
      return false;
    }
  };

  // Login existing member
  const loginExistingMember = async (phoneNumber: string): Promise<LoginResponse> => {
    try {
      const response = await fetch("/api/login-community-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: phoneNumber }),
      });

      return await response.json();
    } catch (error) {
      console.error("Error logging in:", error);
      return { success: false, message: "Login failed" };
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

      // For login tab, directly login without OTP or reCAPTCHA
      if (activeTab === "login") {
        const isExisting = await checkExistingMember(phone);
        if (!isExisting) {
          setErrorMessage("No account found with this phone number. Please sign up instead.");
          return;
        }

        // Directly login if user exists
        const loginResult = await loginExistingMember(phone);
        if (loginResult.success && loginResult.token && loginResult.user) {
          // Store JWT token and user data
          localStorage.setItem("communityToken", loginResult.token);
          localStorage.setItem("userData", JSON.stringify(loginResult.user));
          setUserData(loginResult.user);
          setHasExistingSession(true);
        } else {
          throw new Error(loginResult.message || "Login failed");
        }
        return;
      }

      // For signup tab, proceed with OTP verification
      const formattedPhone = `+91${phone}`;

      // Ensure reCAPTCHA is initialized for signup
      if (!recaptchaVerifier.current || !recaptchaInitialized.current) {
        setErrorMessage("Security verification is initializing. Please try again in a moment.");
        initializeRecaptcha();
        return;
      }

      const result = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier.current);

      setConfirmationResult(result);
      setOtpSent(true);
      setErrorMessage(null);
    } catch (error: any) {
      console.error("Error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many attempts. Please try again later.");
      } else if (error.code === "auth/invalid-phone-number") {
        setErrorMessage("Invalid phone number format.");
      } else if (error.code === "auth/captcha-check-failed") {
        setErrorMessage("Security verification failed. Please switch tabs and try again.");
        cleanupRecaptcha();
      } else {
        setErrorMessage(
          `Failed to ${activeTab === "login" ? "login" : "send OTP"}: ${error.message || "Unknown error"}`
        );
      }

      // Reset reCAPTCHA on error for signup tab
      if (activeTab === "signup") {
        cleanupRecaptcha();
        // Reinitialize after a delay
        setTimeout(() => {
          if (needsRecaptcha.current) {
            initializeRecaptcha();
          }
        }, 1000);
      }
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
      setErrorMessage(null);

      // Clean up reCAPTCHA after successful OTP verification
      cleanupRecaptcha();
    } catch (error: any) {
      console.error("Error verifying OTP:", error);
      setErrorMessage(`Invalid OTP: ${error.message || "Please check the code and try again"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // For login tab, no need to submit form (already handled in handleSendOtp)
    if (activeTab === "login") {
      return;
    }

    // For signup tab, validate OTP and fields
    if (activeTab === "signup") {
      if (!otpVerified) {
        setErrorMessage("Please verify your phone number first");
        return;
      }

      if (!name || !email) {
        setErrorMessage("Please fill in all required fields");
        return;
      }
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      // Register new user
      const response = await fetch("/api/save-community-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Registration failed");
      }

      // Store JWT token and user data
      if (data.token && data.user) {
        localStorage.setItem("communityToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
        setUserData(data.user);
      } else {
        // Fallback: create local user data
        const userData = { id: data.userId || Date.now().toString(), name, email, phone };
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("communityToken", data.token || "fallback-token");
        setUserData(userData);
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
    // Use router for navigation
    router.push("/Community");
    // Also call the callback if provided
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

    // Clean up reCAPTCHA
    cleanupRecaptcha();
  };

  const handleTabSwitch = (tab: TabType) => {
    setActiveTab(tab);
    setErrorMessage(null);

    // Update reCAPTCHA needs
    needsRecaptcha.current = tab === "signup";

    // Clean up existing reCAPTCHA
    cleanupRecaptcha();

    // Initialize reCAPTCHA if switching to signup tab
    if (tab === "signup") {
      needsRecaptcha.current = true;
      setTimeout(() => {
        if (needsRecaptcha.current) {
          initializeRecaptcha();
        }
      }, 300);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      resetForm();
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-8 shadow-brand">
        <button
          onClick={() => {
            resetForm();
            onClose();
          }}
          className="absolute right-6 top-6 text-2xl text-brand-tealDark transition-colors hover:text-brand-coral"
        >
          &times;
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-brand-tealDark">
            {hasExistingSession
              ? "Welcome Back!"
              : registrationSuccess
                ? "Welcome to Our Community!"
                : "Join Our Community"}
          </h2>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-brand-gold"></div>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-100 p-4 text-red-700">
            <div className="flex items-center">
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {hasExistingSession ? (
          <div className="py-4 text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-brand-teal/10">
              <span className="text-3xl font-semibold text-brand-teal">
                {userData?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-brand-tealDark">
              {userData?.name || "User"}
            </h3>
            <p className="mb-3 text-brand-tealDark/80">{userData?.email}</p>
            <p className="mb-8 text-brand-tealDark/80">{userData?.phone}</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleGoToCommunity}
                className="w-full rounded-xl bg-brand-teal px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-brand-tealDark"
              >
                Go to Community
              </button>
              <button
                onClick={handleLogout}
                className="w-full rounded-xl border border-brand-teal/30 px-6 py-2.5 font-medium text-brand-teal transition-colors hover:bg-brand-teal/5"
              >
                Logout
              </button>
            </div>
          </div>
        ) : registrationSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-10 w-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-brand-tealDark">Success!</h3>
            <p className="mb-8 text-brand-tealDark/80">
              Your account has been created successfully. You're now part of our community.
            </p>
            <button
              onClick={handleGoToCommunity}
              className="w-full rounded-xl bg-brand-teal px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-brand-tealDark"
            >
              Go to Community
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Navigation */}
            <div className="flex rounded-xl bg-brand-grayBg p-1">
              <button
                type="button"
                onClick={() => handleTabSwitch("signup")}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === "signup"
                    ? "bg-white text-brand-tealDark shadow-sm"
                    : "text-brand-tealDark/60 hover:text-brand-tealDark"
                }`}
              >
                New Member
              </button>
              <button
                type="button"
                onClick={() => handleTabSwitch("login")}
                className={`flex-1 rounded-lg px-4 py-3 text-sm font-medium transition-all ${
                  activeTab === "login"
                    ? "bg-white text-brand-tealDark shadow-sm"
                    : "text-brand-tealDark/60 hover:text-brand-tealDark"
                }`}
              >
                Existing Member
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email fields only for signup */}
              {activeTab === "signup" && !otpSent && (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-tealDark">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full rounded-xl border border-brand-teal/20 px-4 py-3 transition-all focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      placeholder="Enter your full name"
                      disabled={loading}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-brand-tealDark">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full rounded-xl border border-brand-teal/20 px-4 py-3 transition-all focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      placeholder="Enter your email"
                      disabled={loading}
                    />
                  </div>
                </>
              )}

              {/* Phone number field for both tabs */}
              <div>
                <label className="mb-2 block text-sm font-medium text-brand-tealDark">
                  Mobile Number *
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                      <span className="text-brand-tealDark/60">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      required
                      disabled={(activeTab === "signup" && otpSent) || loading}
                      maxLength={10}
                      className="w-full rounded-xl border border-brand-teal/20 px-4 py-3 pl-12 transition-all focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/50 disabled:bg-brand-grayBg"
                      placeholder="10-digit number"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!phone || phone.length < 10 || loading}
                    className="whitespace-nowrap rounded-xl bg-brand-teal px-5 py-3 text-white shadow-md transition-colors hover:bg-brand-tealDark disabled:cursor-not-allowed disabled:bg-brand-teal/40"
                  >
                    {loading
                      ? activeTab === "login"
                        ? "Logging in..."
                        : "Sending..."
                      : activeTab === "login"
                        ? "Login"
                        : otpSent
                          ? "Sent"
                          : "Send OTP"}
                  </button>
                </div>
              </div>

              {/* OTP field - Only for signup tab */}
              {activeTab === "signup" && otpSent && (
                <div>
                  <label className="mb-2 block text-sm font-medium text-brand-tealDark">
                    Enter OTP *
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="flex-1 rounded-xl border border-brand-teal/20 px-4 py-3 transition-all focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/50"
                      disabled={loading || otpVerified}
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otpVerified || !otp || otp.length !== 6 || loading}
                      className={`rounded-xl px-5 py-3 shadow-md transition-colors ${
                        otpVerified
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-brand-teal text-white hover:bg-brand-tealDark"
                      } whitespace-nowrap disabled:cursor-not-allowed disabled:bg-brand-teal/40`}
                    >
                      {loading ? "Verifying..." : otpVerified ? "Verified" : "Verify"}
                    </button>
                  </div>
                </div>
              )}

              {/* reCAPTCHA container - Only for signup tab */}
              {activeTab === "signup" && !otpVerified && (
                <div id="recaptcha-container" className="min-h-[1px]"></div>
              )}

              {/* Submit buttons */}
              {activeTab === "signup" && otpVerified && (
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-brand-teal px-6 py-3 font-medium text-white shadow-md transition-colors hover:bg-brand-tealDark disabled:cursor-not-allowed disabled:bg-brand-teal/40"
                >
                  {loading ? "Processing..." : "Save & Join Community"}
                </button>
              )}

              {activeTab === "signup" && !otpVerified && (
                <button
                  type="submit"
                  disabled={true}
                  className="w-full cursor-not-allowed rounded-xl bg-brand-teal/40 px-6 py-3 font-medium text-white"
                >
                  Verify OTP to Continue
                </button>
              )}

              <p className="mt-6 text-center text-xs text-brand-tealDark/60">
                By joining, you agree to our Terms of Service and Privacy Policy
              </p>
            </form>

            {/* Tab switch suggestion */}
            <div className="text-center">
              <p className="text-sm text-brand-tealDark/60">
                {activeTab === "signup" ? (
                  <>
                    Already a member?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("login")}
                      className="font-medium text-brand-teal transition-colors hover:text-brand-tealDark"
                    >
                      Login here
                    </button>
                  </>
                ) : (
                  <>
                    New to our community?{" "}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch("signup")}
                      className="font-medium text-brand-teal transition-colors hover:text-brand-tealDark"
                    >
                      Sign up here
                    </button>
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
