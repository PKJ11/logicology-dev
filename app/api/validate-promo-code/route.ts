// app/api/validate-promo-code/route.ts
import { NextRequest, NextResponse } from "next/server";

interface PriceTier {
  matchAmount: number; // the base price this tier applies to
  finalPrice: number;  // the price after the promo is applied
}

interface PromoCodeDetails {
  type: "percentage" | "fixed" | "price_tiers";
  discount?: number;          // used for percentage / fixed
  minAmount: number;
  maxDiscount?: number;       // used for percentage
  tiers?: PriceTier[];        // used for price_tiers
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
  // 10% off with minimum order of ₹500
  LOGIC10: { 
    discount: 10, 
    type: "percentage", 
    minAmount: 500,
    maxDiscount: 5000 // maximum discount of ₹5,000
  },

  // 20% off with minimum order of ₹1000
  REPEAT20: { 
    discount: 20, 
    type: "percentage", 
    minAmount: 1000,
    maxDiscount: 5000 // maximum discount of ₹5,000
  },

  // 20% off with minimum order of ₹500 (existing code)
  LAUNCH20: { 
    discount: 20, 
    type: "percentage", 
    minAmount: 500, 
    maxDiscount: 5000 
  },

  // Swanil Foundation exclusive: snaps ₹249 books to ₹180, and the ₹999
  // 5-book set to ₹650. Add more { matchAmount, finalPrice } tiers here
  // if you introduce other price points this code should cover.
  LOGIC40SWANIL: {
    type: "price_tiers",
    minAmount: 0,
    tiers: [
      { matchAmount: 249, finalPrice: 180 }, // single volume
      { matchAmount: 999, finalPrice: 650 }, // full set of 5
    ],
  },
};

const TOLERANCE = 1; // rupees, to absorb any rounding

export async function POST(request: NextRequest) {
  try {
    const { promoCode, cartTotal } = await request.json();

    if (!promoCode) {
      return NextResponse.json(
        { success: false, message: "Promo code is required" },
        { status: 400 }
      );
    }

    const code = promoCode.toUpperCase().trim();
    const promo = PROMO_CODES[code];

    if (!promo) {
      return NextResponse.json({ success: false, message: "Invalid promo code" }, { status: 400 });
    }

    if (cartTotal < promo.minAmount) {
      return NextResponse.json(
        {
          success: false,
          message: `Minimum order value of ₹${promo.minAmount} required for this promo code`,
        },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    let value = promo.discount ?? 0;

    if (promo.type === "percentage") {
      discountAmount = (cartTotal * (promo.discount ?? 0)) / 100;
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else if (promo.type === "fixed") {
      discountAmount = promo.discount ?? 0;
    } else if (promo.type === "price_tiers") {
      const tier = promo.tiers?.find(
        (t) => Math.abs(t.matchAmount - cartTotal) <= TOLERANCE
      );

      if (!tier) {
        return NextResponse.json(
          {
            success: false,
            message: "This code isn't valid for this item.",
          },
          { status: 400 }
        );
      }

      discountAmount = cartTotal - tier.finalPrice;
      value = tier.finalPrice; // report the resulting price as the "value"
    }

    discountAmount = Math.max(0, Math.min(discountAmount, cartTotal));

    const response: PromoCodeResponse = {
      success: true,
      promoCode: code,
      discountAmount: Math.round(discountAmount),
      finalAmount: Math.round(cartTotal - discountAmount),
      promoDetails: {
        type: promo.type,
        value,
        minAmount: promo.minAmount,
        ...(promo.maxDiscount && { maxDiscount: promo.maxDiscount }),
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Promo code validation error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ success: false, message: "Method not allowed" }, { status: 405 });
}