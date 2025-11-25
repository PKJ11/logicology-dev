# Meta Pixel Purchase Event Tracking Guide

## Overview

Meta Pixel purchase events are now integrated into your Logicology application for tracking conversions on both the **Cart Page** and **Product Detail Page**.

## Files Modified/Created

### 1. **New File: `/lib/meta-pixel-events.ts`**

This file contains utility functions for tracking Meta Pixel events:

- `trackMetaPixelPurchase()` - Track purchase conversions
- `trackMetaPixelAddToCart()` - Track add to cart
- `trackMetaPixelViewContent()` - Track product views
- `trackMetaPixelInitiateCheckout()` - Track checkout initiation
- `trackMetaPixelCustomEvent()` - Track custom events

### 2. **Updated: `/app/cart/page.tsx`**

Added Meta Pixel purchase tracking in the payment success handler:

- Imported `trackMetaPixelPurchase` from `@/lib/meta-pixel-events`
- Added Meta Pixel purchase event tracking after successful payment

### 3. **Updated: `/app/products/[id]/page.tsx`**

Added Meta Pixel tracking across multiple user interactions:

- Imported Meta Pixel tracking functions
- Added product view tracking (`trackMetaPixelViewContent()`)
- Added add to cart tracking (`trackMetaPixelAddToCart()`)
- Added checkout initiation tracking (`trackMetaPixelInitiateCheckout()`)
- Added purchase event tracking (`trackMetaPixelPurchase()`) in the payment handler

## How It Works

### Purchase Event Flow

#### On Cart Page (Buy Now → Checkout):

```
1. User completes payment
2. Payment success handler triggers
3. Google Analytics purchase event recorded
4. ✅ META PIXEL PURCHASE event recorded with:
   - Transaction ID (Razorpay Payment ID)
   - Currency (INR)
   - Total purchase value
   - Item details (ID, name, price, quantity)
   - Timestamp
```

#### On Product Page (Buy Now → Checkout):

```
1. User views product
   → trackMetaPixelViewContent() fires
2. User clicks "Add to Cart"
   → trackMetaPixelAddToCart() fires
3. User clicks "Buy Now"
   → trackMetaPixelInitiateCheckout() fires
4. User completes payment
   → ✅ trackMetaPixelPurchase() fires with all order data
```

## Meta Pixel Event Data Format

### Purchase Event

```javascript
{
  currency: "INR",
  value: "1499.00",           // Total purchase amount
  content_name: "Order abc123",
  content_ids: ["item-001"],  // Array of product IDs
  content_type: "product",
  contents: [
    {
      id: "item-001",
      title: "Prime Time Game",
      quantity: 1,
      delivery_category: "home_delivery"
    }
  ]
}
```

## Implementation Details

### Cart Page Integration

```typescript
// After successful Razorpay payment
trackMetaPixelPurchase(
  "INR",
  finalAmount, // Total amount after discount
  cart.map((item) => ({
    item_id: item.razorpayItemId,
    title: item.name,
    price: parseFloat(item.price.replace(/[^\d.]/g, "")),
    quantity: item.quantity || 1,
  })),
  response.razorpay_payment_id // Transaction ID
);
```

### Product Page Integration

```typescript
// On payment success
trackMetaPixelPurchase(
  "INR",
  finalAmount,
  [
    {
      item_id: product.razorpayItemId,
      title: itemDetails?.name || product.name,
      price: itemDetails?.price || parseFloat(product.price.replace(/[^\d.]/g, "")),
      quantity: 1,
    },
  ],
  response.razorpay_payment_id
);
```

## Event Order

```mermaid
User Journey:
1. Views Product
   └─ trackMetaPixelViewContent()

2. Adds to Cart
   └─ trackMetaPixelAddToCart()

3. Clicks Buy Now/Checkout
   └─ trackMetaPixelInitiateCheckout()

4. Completes Payment
   └─ 🎯 trackMetaPixelPurchase()  [CONVERSION]
```

## Verification

To verify Meta Pixel purchase events are firing:

1. **In Meta Pixel Helper** (Facebook's debugging tool):
   - Go to your Facebook Business Account
   - Open Meta Pixel Helper Chrome extension
   - Complete a purchase
   - Check the "Events" tab for "Purchase" events

2. **In Browser Console**:

   ```javascript
   // Meta Pixel will log if window.fbq is available
   window.fbq("track", "Purchase", { ...eventData });
   ```

3. **In Meta Events Manager**:
   - Navigate to your Meta Ads Manager
   - Go to Events Manager
   - Filter by "Purchase" event
   - Check real-time event data

## Key Points

✅ **Purchase events fire on both pages**:

- Cart page: After checkout completion
- Product page: After direct purchase

✅ **Data includes**:

- Transaction ID (Payment ID)
- Currency
- Total value
- Item IDs and details
- Quantities

✅ **Integration with existing tracking**:

- Works alongside Google Analytics
- No conflicts or duplicates
- Both systems capture the same conversion

✅ **Error handling**:

- Checks if `window.fbq` exists before calling
- Logs warnings if Meta Pixel not loaded
- Gracefully handles missing data

## Testing Checklist

- [ ] Navigate to product page
- [ ] View product (trackMetaPixelViewContent fires)
- [ ] Click "Add to Cart" (trackMetaPixelAddToCart fires)
- [ ] Click "Buy Now" (trackMetaPixelInitiateCheckout fires)
- [ ] Complete checkout and payment
- [ ] Verify "Purchase" event in Meta Events Manager
- [ ] Verify event has correct amount, currency, and item data
- [ ] Repeat test for cart page direct purchase
- [ ] Check Meta Pixel Helper browser extension for events

## Troubleshooting

**Issue**: Purchase event not appearing in Meta Events Manager

- **Solution**: Verify Meta Pixel code is loaded in `layout.tsx`
- **Check**: Browser console for `window.fbq` availability

**Issue**: Wrong amount or currency in events

- **Solution**: Verify `finalAmount` calculation and currency code
- **Check**: Amount is in correct format (2 decimal places)

**Issue**: Missing item data

- **Solution**: Ensure `item_id`, `title`, `quantity` are properly mapped
- **Check**: No undefined values being passed

## Next Steps

Consider implementing:

1. **AddPaymentInfo** event tracking for when users enter payment details
2. **OptimizeEvents** - Let Meta optimize for purchases
3. **Server-side conversions API** for improved attribution
4. **Dynamic product ads** using the Meta catalog

---

**Last Updated**: November 25, 2025
**Status**: ✅ Active and implemented
