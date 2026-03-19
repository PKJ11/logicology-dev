interface RazorpayOptions {
  orderId: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: any) => void;
}

export const initiateRazorpayPayment = (options: RazorpayOptions): Promise<{ success: boolean; error?: string }> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !(window as any).Razorpay) {
      resolve({ success: false, error: 'Razorpay SDK not loaded' });
      return;
    }

    const razorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_RNIwt54hh7eqmk',
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: options.prefill,
      handler: options.handler,
      modal: {
        ondismiss: () => {
          resolve({ success: false, error: 'Payment cancelled' });
        }
      },
      theme: {
        color: '#f97316' // Orange color
      }
    };

    const razorpay = new (window as any).Razorpay(razorpayOptions);
    
    razorpay.on('payment.failed', (response: any) => {
      resolve({ 
        success: false, 
        error: response.error.description || 'Payment failed' 
      });
    });

    razorpay.open();
  });
};

export const validatePayment = async (
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> => {
  try {
    const response = await fetch('/api/razorpay/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId,
        paymentId,
        signature
      })
    });

    const data = await response.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating payment:', error);
    return false;
  }
};