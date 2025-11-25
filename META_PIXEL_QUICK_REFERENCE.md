# Meta Pixel Purchase Event - Quick Reference

## 🎯 What Was Added

Meta Pixel purchase event tracking on:

- ✅ **Cart Page** - Track purchases from `/cart`
- ✅ **Product Page** - Track direct purchases from `/products/[id]`

## 🚀 How It Works

### On Cart Page

```
Proceed to Checkout → Enter Details → Complete Payment → 🎯 Purchase Event Sent
```

### On Product Page

```
View Product → Add to Cart → Buy Now → Enter Details → Complete Payment → 🎯 Purchase Event Sent
```

## 📊 Data Sent to Meta Pixel

```javascript
{
  currency: "INR",
  value: "1499.00",           // Amount with decimals
  content_ids: ["item-id"],
  content_type: "product",
  contents: [
    {
      id: "item-id",
      title: "Product Name",
      quantity: 1,
      delivery_category: "home_delivery"
    }
  ],
  content_name: "Order [Payment-ID]"
}
```

## 📁 Files Changed

1. **NEW**: `/lib/meta-pixel-events.ts` - Helper functions
2. **UPDATED**: `/app/cart/page.tsx` - Purchase tracking in payment handler
3. **UPDATED**: `/app/products/[id]/page.tsx` - Complete event tracking pipeline

## ✅ Verification Steps

### Step 1: Check Meta Pixel Helper (Chrome Extension)

1. Install Meta Pixel Helper from Chrome Web Store
2. Make a test purchase
3. Click the extension icon
4. Look for "Purchase" event in the list

### Step 2: Check Events Manager

1. Go to Meta Business Suite → Events Manager
2. Select your pixel
3. Filter by "Purchase" event
4. Should see events in real-time

### Step 3: Browser Console

```javascript
// Should see fbq being called
window.fbq('track', 'Purchase', {...})
```

## 🔧 Customization

### To modify purchase event data:

**In `/app/cart/page.tsx`** (around line 800):

```typescript
trackMetaPixelPurchase(
  "INR",                    // Change currency if needed
  finalAmount,              // Total amount
  cart.map(...),            // Items array
  response.razorpay_payment_id  // Transaction ID
);
```

**In `/app/products/[id]/page.tsx`** (around line 680):

```typescript
trackMetaPixelPurchase(
  "INR",
  finalAmount,
  [{...}],                  // Product details
  response.razorpay_payment_id
);
```

## 🐛 Troubleshooting

| Issue              | Solution                               |
| ------------------ | -------------------------------------- |
| Events not showing | Verify Meta Pixel code in `layout.tsx` |
| Wrong amount       | Check `finalAmount` calculation        |
| Missing items      | Ensure item IDs are mapped correctly   |
| fbq undefined      | Meta Pixel script may not be loaded    |

## 📱 Events Fired (Complete Journey)

```
1. View Product Page
   └─ trackMetaPixelViewContent()

2. Click Add to Cart
   └─ trackMetaPixelAddToCart()

3. Click Buy Now
   └─ trackMetaPixelInitiateCheckout()

4. Complete Payment ✅
   └─ trackMetaPixelPurchase() ← CONVERSION!
```

## 🎓 Available Functions

```typescript
// Purchase conversion
trackMetaPixelPurchase(currency, value, items, transactionId);

// Add to cart
trackMetaPixelAddToCart(currency, value, items);

// View product
trackMetaPixelViewContent(currency, value, items);

// Checkout started
trackMetaPixelInitiateCheckout(currency, value, numItems);

// Custom event
trackMetaPixelCustomEvent(eventName, eventData);
```

## 📝 Notes

- Events fire automatically after successful payment
- Works with both Razorpay orders (cart) and single products
- No manual intervention needed - just complete the purchase
- Data matches your GST invoice for accuracy
- Integrates with existing Google Analytics tracking

---

**Status**: ✅ Active | **Updated**: Nov 25, 2025
