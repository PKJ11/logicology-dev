// app/primetime-competition/payment/page.tsx - SIMPLIFIED
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, CreditCard, Shield, Check } from "lucide-react";

const RAZORPAY_KEY_ID = "rzp_live_RNIwt54hh7eqmk";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      fetchUserDetails();
    } else {
      router.push("/primetime-competition/register");
    }
  }, [userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(`/api/primetime/user-details?userId=${userId}`);
      const data = await response.json();

      if (data.success) {
        setUserDetails(data.user);

        // If already paid, redirect to confirmation
        if (data.user.paymentStatus === "completed") {
          router.push(`/primetime-competition/confirmation?userId=${userId}`);
        }
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    } finally {
      setLoading(false);
    }
  };

  const initiatePayment = () => {
    if (!window.Razorpay || !userDetails) return;

    setProcessing(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: 11800, // ₹118 in paise
      currency: "INR",
      name: "Logicology - PrimeTime Competition",
      description: "Registration Fee",
      image: "https://www.logicology.in/logo.png",
      order_id: undefined, // Razorpay will generate order automatically
      handler: async (response: any) => {
        // Send verification to your API
        const verifyRes = await fetch("/api/primetime/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
            amount: 11800,
          }),
        });

        const data = await verifyRes.json();

        if (data.success) {
          // Send confirmation email
          await sendConfirmationEmail(response.razorpay_payment_id);

          // Redirect to confirmation page
          router.push(
            `/primetime-competition/confirmation?userId=${userId}&paymentId=${response.razorpay_payment_id}`
          );
        } else {
          alert("Payment verification failed. Please contact support.");
          setProcessing(false);
        }
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.phone,
      },
      notes: {
        userId: userId,
        purpose: "primetime_competition",
      },
      theme: {
        color: "#0A8A80",
      },
      modal: {
        ondismiss: () => {
          setProcessing(false);
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const sendConfirmationEmail = async (paymentId: string) => {
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: userDetails.email,
          subject: "PrimeTime Competition - Payment Confirmation",
          template: "payment-confirmation",
          data: {
            name: userDetails.name,
            paymentId: paymentId,
            amount: 118,
            competitionDate: "Coming Soon",
          },
        }),
      });
    } catch (error) {
      console.error("Error sending confirmation email:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-md overflow-hidden rounded-2xl bg-white shadow-lg">
          {/* Header */}
          <div className="bg-brand-teal p-8 text-center text-white">
            <CreditCard className="mx-auto mb-4 h-16 w-16" />
            <h1 className="mb-2 text-2xl font-bold">Complete Registration</h1>
            <p className="opacity-90">One last step to secure your spot</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* User Info */}
            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-gray-600">Participant</span>
                <span className="font-semibold">{userDetails?.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-brand-coral">₹118</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="mb-8">
              <h3 className="mb-3 font-semibold text-gray-900">What you get:</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Competition entry</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Certificate of participation</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>Digital scorecard</span>
                </li>
                <li className="flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  <span>GST invoice</span>
                </li>
              </ul>
            </div>

            {/* Security */}
            <div className="mb-6 flex items-center justify-center text-gray-600">
              <Shield className="mr-2 h-5 w-5" />
              <span className="text-sm">Secure payment by Razorpay</span>
            </div>

            {/* Payment Button */}
            <button
              onClick={initiatePayment}
              disabled={processing}
              className="w-full rounded-xl bg-brand-coral py-4 font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Pay ₹118 Now"
              )}
            </button>

            {/* Help Text */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Need help? Contact us at logicologymeta@gmail.com
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
