"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Script from "next/script";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("userId");

  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      createOrder();
    }
  }, [userId]);

  const createOrder = async () => {
    try {
      const response = await fetch("/api/primetime/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      setOrder(data.order);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = () => {
    if (!window.Razorpay || !order) return;

    setPaymentLoading(true);

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod",
      amount: order.amount,
      currency: order.currency,
      name: "Primetime Chess Competition",
      description: "Registration Fee",
      order_id: order.id,
      handler: async function (response: any) {
        // Verify payment
        const verifyRes = await fetch("/api/primetime/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId,
          }),
        });

        const data = await verifyRes.json();

        if (verifyRes.ok) {
          router.push(`/primetime-competition/book-slot?userId=${userId}`);
        } else {
          setError("Payment verification failed");
          setPaymentLoading(false);
        }
      },
      prefill: {
        name: order.notes?.name || "",
        email: order.notes?.email || "",
        contact: order.notes?.phone || "",
      },
      theme: {
        color: "#0A8A80",
      },
      modal: {
        ondismiss: function () {
          setPaymentLoading(false);
        },
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
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
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
        <div className="container mx-auto max-w-2xl px-4">
          <div className="rounded-4xl bg-white p-8 shadow-soft">
            <div className="mb-10 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-teal/10">
                <CheckCircle className="h-10 w-10 text-brand-teal" />
              </div>
              <h1 className="mb-4 font-heading text-4xl font-bold text-brand-tealDark">
                Complete Your Registration
              </h1>
              <p className="text-gray-600">One more step to secure your spot in the competition</p>
            </div>

            <div className="mb-8 rounded-3xl bg-brand-grayBg p-8">
              <h3 className="mb-6 text-xl font-bold text-brand-tealDark">Payment Details</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 py-3">
                  <span className="text-gray-600">Registration Fee</span>
                  <span className="text-2xl font-bold text-brand-teal">₹100</span>
                </div>

                <div className="rounded-2xl border-2 border-brand-yellow bg-yellow-50 p-4">
                  <div className="flex items-start">
                    <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-brand-gold" />
                    <div className="text-sm">
                      <span className="font-semibold">Note:</span> This is a one-time registration
                      fee for non-school participants. School students register for free.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && <div className="mb-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</div>}

            <button
              onClick={handlePayment}
              disabled={paymentLoading || !order}
              className="w-full rounded-full bg-brand-teal py-4 text-lg font-bold text-white shadow-lg transition-all hover:bg-brand-tealDark hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paymentLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                  Processing...
                </div>
              ) : (
                "Pay ₹100 Now"
              )}
            </button>

            <div className="mt-6 text-center text-sm text-gray-500">
              Secure payment powered by Razorpay
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
