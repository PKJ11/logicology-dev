// lib/gst-utils.ts
export const COMPANY_GST_NUMBER = "27AADCL3493J1Z6";

export interface CartItem {
  name: string;
  price: string;
  initialprice?: string;
  razorpayItemId: string;
  description?: string;
  image?: string;
  rating?: number;
  quantity?: number;
}

export interface ItemDetails {
  [itemId: string]: {
    tax_rate?: number;
    hsn_code?: string;
  };
}

export function generateGSTReceipt(cart: CartItem[], itemDetails: ItemDetails) {
  let totalAmount = 0;
  let totalGST = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let rows = "";
  
  cart.forEach((item, idx) => {
    const details = itemDetails[item.razorpayItemId] || {};
    const price = parseFloat(item.price.replace(/[^\d.]/g, ""));
    const quantity = item.quantity || 1;
    const gstRate = details.tax_rate || 0;
    const hsnCode = details.hsn_code || "-";
    
    // GST calculation: Assuming price is GST inclusive
    const gstAmount = gstRate > 0 ? (price * gstRate) / (100 + gstRate) : 0;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const basePrice = price - gstAmount;
    const totalItemAmount = price * quantity;
    
    totalAmount += totalItemAmount;
    totalGST += gstAmount * quantity;
    cgstTotal += cgstAmount * quantity;
    sgstTotal += sgstAmount * quantity;
    
    rows += `
      <tr style="border-bottom: 1px solid #ddd;">
        <td style="padding: 10px; text-align: center;">${idx + 1}</td>
        <td style="padding: 10px;">${item.name}</td>
        <td style="padding: 10px; text-align: center;">${hsnCode}</td>
        <td style="padding: 10px; text-align: center;">${quantity}</td>
        <td style="padding: 10px; text-align: right;">₹${basePrice.toFixed(2)}</td>
        <td style="padding: 10px; text-align: center;">${gstRate}%</td>
        <td style="padding: 10px; text-align: right;">₹${(gstAmount * quantity).toFixed(2)}</td>
        <td style="padding: 10px; text-align: right;">₹${totalItemAmount.toFixed(2)}</td>
      </tr>
    `;
  });

  // Dynamic GST breakdown based on actual rates
  const gstBreakdown = `
    <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <h3 style="color: #6A294D; margin-top: 0;">GST Breakdown</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${cgstTotal > 0 ? `<div>CGST:</div><div style="text-align: right;">₹${cgstTotal.toFixed(2)}</div>` : ''}
        ${sgstTotal > 0 ? `<div>SGST:</div><div style="text-align: right;">₹${sgstTotal.toFixed(2)}</div>` : ''}
        <div style="font-weight: bold; border-top: 1px solid #ddd; padding-top: 5px;">Total GST:</div>
        <div style="font-weight: bold; text-align: right; border-top: 1px solid #ddd; padding-top: 5px;">₹${totalGST.toFixed(2)}</div>
      </div>
    </div>
  `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; border: 2px solid #6A294D; padding: 20px; background: #fff;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #6A294D; padding-bottom: 15px; margin-bottom: 20px;">
        <h1 style="color: #6A294D; margin: 0; font-size: 28px;">TAX INVOICE</h1>
        <h2 style="color: #EB6A42; margin: 5px 0; font-size: 20px;">Logicology Educational Products</h2>
        <p style="margin: 5px 0; color: #666;">GSTIN: ${COMPANY_GST_NUMBER}</p>
      </div>
      
      <!-- Invoice Table -->
      <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 20px;">
        <thead>
          <tr style="background: #6A294D; color: white;">
            <th style="padding: 12px; border: 1px solid #ddd;">#</th>
            <th style="padding: 12px; border: 1px solid #ddd; text-align: left;">Item Description</th>
            <th style="padding: 12px; border: 1px solid #ddd;">HSN Code</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Qty</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Unit Price</th>
            <th style="padding: 12px; border: 1px solid #ddd;">GST Rate</th>
            <th style="padding: 12px; border: 1px solid #ddd;">GST Amount</th>
            <th style="padding: 12px; border: 1px solid #ddd;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
      
      ${gstBreakdown}
      
      <!-- Total Amount -->
      <div style="text-align: right; font-size: 16px; font-weight: bold; padding: 15px; background: #6A294D; color: white; border-radius: 5px;">
        Grand Total: ₹${totalAmount.toFixed(2)}
      </div>
      
      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
        <p>This is a computer generated invoice. No signature required.</p>
        <p>For queries, contact: logicologymeta@gmail.com | WhatsApp: 8446980747</p>
      </div>
    </div>
  `;
}