import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "t8NMj5PKyi0Af2b15uARbtLl";

// Create invoice with details
export async function POST(req: NextRequest) {
  const body = await req.json();
  const razorpay = new Razorpay({ key_id, key_secret });

  // Example: create invoice with details
  // See https://razorpay.com/docs/api/invoices/#create-an-invoice
  const invoiceOptions: {
    type: "invoice" | "link";
    description?: string;
    customer?: {
      name?: string;
      email?: string;
      contact?: string;
      billing_address?: any;
      shipping_address?: any;
    };
    line_items: any[];
    currency?: string;
    amount?: number;
    receipt?: string;
    sms_notify: 0 | 1;
    email_notify: 0 | 1;
    expire_by?: number;
    notes?: any;
  } = {
    type: "invoice",
    description: body.description || "Logicology Order Invoice",
    customer: {
      name: body.name,
      email: body.email,
      contact: body.phone,
      billing_address: body.billing_address,
      shipping_address: body.shipping_address,
    },
    line_items: Array.isArray(body.line_items) ? body.line_items : [],
    currency: body.currency || "INR",
    amount: body.amount,
    receipt: body.receipt,
    sms_notify: 1,
    email_notify: 1,
    expire_by: body.expire_by,
    notes: body.notes || {},
  };

  try {
    const invoice = await razorpay.invoices.create(invoiceOptions);
    return NextResponse.json({ invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Issue an invoice (finalize and send to customer)
export async function PUT(req: NextRequest) {
  const { invoice_id } = await req.json();
  const razorpay = new Razorpay({ key_id, key_secret });
  try {
    const issued = await razorpay.invoices.issue(invoice_id);
    return NextResponse.json({ issued });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
