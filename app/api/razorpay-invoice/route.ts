import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";
const key_secret = process.env.RAZORPAY_KEY_SECRET || "t8NMj5PKyi0Af2b15uARbtLl";

// Create invoice with details
export async function POST(req: NextRequest) {
  const body = await req.json();
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || key_id,
    key_secret: process.env.RAZORPAY_KEY_SECRET || key_secret,
  });

  // Fix address structure for Razorpay API
  const billing_address = typeof body.billing_address === "object"
    ? body.billing_address
    : {
        line1: body.billing_address || "",
        line2: "",
        zipcode: body.billing_zipcode || "",
        city: body.billing_city || "",
        state: body.billing_state || "",
        country: "IN",
      };
  const shipping_address = typeof body.shipping_address === "object"
    ? body.shipping_address
    : {
        line1: body.shipping_address || "",
        line2: "",
        zipcode: body.shipping_zipcode || "",
        city: body.shipping_city || "",
        state: body.shipping_state || "",
        country: "IN",
      };

  const invoiceOptions: {
    type: "invoice" | "link";
    description?: string;
    partial_payment?: boolean;
    customer?: {
      name?: string;
      email?: string;
      contact?: string;
      billing_address?: any;
      shipping_address?: any;
    };
    line_items: any[];
    currency?: string;
    expire_by?: number;
    notes?: any;
    sms_notify?: boolean;
    email_notify?: boolean;
    receipt?: string;
  } = {
    type: "invoice",
    description: body.description || "Logicology Order Invoice",
    partial_payment: body.partial_payment || false,
    customer: {
      name: body.name,
      email: body.email,
      contact: body.phone,
      billing_address,
      shipping_address,
    },
    line_items: Array.isArray(body.line_items) ? body.line_items : [],
    currency: body.currency || "INR",
    expire_by: body.expire_by,
    notes: body.notes || {},
    sms_notify: body.sms_notify === undefined ? true : !!body.sms_notify,
    email_notify: body.email_notify === undefined ? false : !!body.email_notify,
    receipt: body.receipt,
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
    // Issue the invoice
    await razorpay.invoices.issue(invoice_id);
    // Fetch the invoice details to get the latest status
    const invoice = await razorpay.invoices.fetch(invoice_id);
    return NextResponse.json({ status: "paid", invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
