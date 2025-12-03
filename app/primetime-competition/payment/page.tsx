'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Script from 'next/script';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';



export default function PaymentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get('userId');
  
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [error, setError] = useState('');
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (userId) {
      createOrder();
    }
  }, [userId]);

  const createOrder = async () => {
    try {
      const response = await fetch('/api/primetime/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
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
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_RM7EaWFSnW9Fod',
      amount: order.amount,
      currency: order.currency,
      name: 'Primetime Chess Competition',
      description: 'Registration Fee',
      order_id: order.id,
      handler: async function(response: any) {
        // Verify payment
        const verifyRes = await fetch('/api/primetime/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
            userId
          })
        });

        const data = await verifyRes.json();

        if (verifyRes.ok) {
          router.push(`/primetime-competition/book-slot?userId=${userId}`);
        } else {
          setError('Payment verification failed');
          setPaymentLoading(false);
        }
      },
      prefill: {
        name: order.notes?.name || '',
        email: order.notes?.email || '',
        contact: order.notes?.phone || ''
      },
      theme: {
        color: '#0A8A80'
      },
      modal: {
        ondismiss: function() {
          setPaymentLoading(false);
        }
      }
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
      
      <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-4xl shadow-soft p-8">
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-brand-teal/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-brand-teal" />
              </div>
              <h1 className="text-4xl font-bold font-heading text-brand-tealDark mb-4">
                Complete Your Registration
              </h1>
              <p className="text-gray-600">
                One more step to secure your spot in the competition
              </p>
            </div>

            <div className="bg-brand-grayBg rounded-3xl p-8 mb-8">
              <h3 className="text-xl font-bold text-brand-tealDark mb-6">
                Payment Details
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Registration Fee</span>
                  <span className="text-2xl font-bold text-brand-teal">₹100</span>
                </div>
                
                <div className="p-4 bg-yellow-50 border-2 border-brand-yellow rounded-2xl">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-brand-gold mr-3 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <span className="font-semibold">Note:</span> This is a one-time registration fee for non-school participants. School students register for free.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl">
                {error}
              </div>
            )}

            <button
              onClick={handlePayment}
              disabled={paymentLoading || !order}
              className="w-full py-4 bg-brand-teal text-white rounded-full font-bold text-lg hover:bg-brand-tealDark transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paymentLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-3" />
                  Processing...
                </div>
              ) : (
                'Pay ₹100 Now'
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