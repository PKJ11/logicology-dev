// app/api/validate-promo-code/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Define proper TypeScript interfaces
interface PromoCodeDetails {
  discount: number;
  type: 'percentage' | 'fixed';
  minAmount: number;
  maxDiscount?: number;
}

interface PromoCodeResponse {
  success: boolean;
  promoCode: string;
  discountAmount: number;
  finalAmount: number;
  promoDetails: {
    type: string;
    value: number;
    minAmount: number;
    maxDiscount?: number;
  };
}

const PROMO_CODES: Record<string, PromoCodeDetails> = {
  // "WELCOME10": { discount: 10, type: "percentage", minAmount: 0, maxDiscount: 500 },
  "LAUNCH20": { discount: 20, type: "percentage", minAmount: 500, maxDiscount: 5000 },
  // "FLAT500": { discount: 500, type: "fixed", minAmount: 2000 },
  // "SUMMER25": { discount: 25, type: "percentage", minAmount: 1500, maxDiscount: 750 }
};

export async function POST(request: NextRequest) {
  try {
    const { promoCode, cartTotal } = await request.json();

    if (!promoCode) {
      return NextResponse.json(
        { success: false, message: 'Promo code is required' },
        { status: 400 }
      );
    }

    const code = promoCode.toUpperCase().trim();
    const promo = PROMO_CODES[code];

    if (!promo) {
      return NextResponse.json(
        { success: false, message: 'Invalid promo code' },
        { status: 400 }
      );
    }

    if (cartTotal < promo.minAmount) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Minimum order value of ₹${promo.minAmount} required for this promo code` 
        },
        { status: 400 }
      );
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promo.type === 'percentage') {
      discountAmount = (cartTotal * promo.discount) / 100;
      // Only apply maxDiscount if it exists and discount exceeds it
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else {
      discountAmount = promo.discount;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    const response: PromoCodeResponse = {
      success: true,
      promoCode: code,
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(cartTotal - discountAmount),
      promoDetails: {
        type: promo.type,
        value: promo.discount,
        minAmount: promo.minAmount,
        ...(promo.maxDiscount && { maxDiscount: promo.maxDiscount }) // Conditionally include maxDiscount
      }
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Promo code validation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add other HTTP methods if needed, but return 405 for unsupported methods
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed' },
    { status: 405 }
  );
}