"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function MyOrdersContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paymentId = searchParams.get("paymentId");
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // Fetch order details from backend using paymentId
    if (paymentId) {
      fetch(`/api/get-order?paymentId=${paymentId}`)
        .then((res) => res.json())
        .then((data) => setOrderDetails(data.order))
        .catch((err) => console.error(err));
    }
  }, [paymentId]);

  if (!orderDetails) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <p className="text-lg text-gray-600">Loading your order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold text-green-600">
          🎉 Payment Successful!
        </h1>
        <p className="mb-6 text-center text-gray-700">
          Thank you for your purchase from <strong>Logicology</strong>!
        </p>

        <div className="space-y-2 border-b border-t py-4 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Payment ID:</span>
            <span>{orderDetails.paymentId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Amount Paid:</span>
            <span>₹{orderDetails.totalAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Customer Name:</span>
            <span>{orderDetails.userInfo?.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-700">Email:</span>
            <span>{orderDetails.userInfo?.email}</span>
          </div>
        </div>

        <p className="mt-6 text-center text-gray-600">
          A detailed GST invoice has been sent to:
          <br />
          <strong>{orderDetails.userInfo?.email}</strong>
        </p>

        <div className="mt-8 flex flex-col space-y-3">
          <Link
            href="/products"
            className="w-full rounded-xl bg-orange-500 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
          >
            Continue Shopping
          </Link>
          <Link
            href="/"
            className="w-full rounded-xl border border-gray-300 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center text-center">
          <p className="text-lg text-gray-600">Loading...</p>
        </div>
      }
    >
      <MyOrdersContent />
    </Suspense>
  );
}
