# Meta Pixel Purchase Event - Visual Implementation Guide

## Event Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     META PIXEL PURCHASE EVENT FLOW                      │
└─────────────────────────────────────────────────────────────────────────┘

╔════════════════════════════════════════════════════════════════════════╗
║                        CART PAGE JOURNEY                                ║
╚════════════════════════════════════════════════════════════════════════╝

     USER                      FRONTEND                    BACKEND
      │                           │                           │
      │  Visit /cart              │                           │
      ├──────────────────────────>│                           │
      │                           │ Display cart items        │
      │<──────────────────────────┤                           │
      │                           │                           │
      │  Click "Proceed to        │                           │
      │   Checkout"               │                           │
      ├──────────────────────────>│                           │
      │                           │ Open checkout modal       │
      │<──────────────────────────┤                           │
      │  Fill shipping &          │                           │
      │  contact info             │                           │
      │  Click "Pay"              │                           │
      ├──────────────────────────>│                           │
      │                           │ Create Razorpay order     │
      │                           ├──────────────────────────>│
      │                           │<──────────────────────────┤
      │  Razorpay Payment         │ Return order ID           │
      │  Modal Opens              │                           │
      │  (User enters card)       │                           │
      │                           │                           │
      │  Razorpay returns         │                           │
      │  payment_id               │                           │
      ├──────────────────────────>│ Verify payment            │
      │                           ├──────────────────────────>│
      │                           │<──────────────────────────┤
      │                           │                           │
      │  🎯 SUCCESS               │                           │
      │  Payment confirmed        │                           │
      ├──────────────────────────>│ 🎯 FIRE PIXEL EVENT       │
      │                           │                           │
      │                           │ trackMetaPixelPurchase(   │
      │                           │   currency: "INR",        │
      │                           │   value: 1499.00,         │
      │                           │   items: [...]            │
      │                           │   transactionId: "abc123" │
      │                           │ )                         │
      │                           │                           │
      │                           │ window.fbq(               │
      │                           │   "track",                │
      │                           │   "Purchase",             │
      │                           │   { ... }                 │
      │                           │ )                         │
      │                           ├─────────────────────────┐ │
      │                           │                         │ │
      │                           │  📤 DATA SENT TO META   │ │
      │                           │   Transaction ID: abc123 │ │
      │                           │   Amount: ₹1,499         │ │
      │                           │   Items: [Prime Time]    │ │
      │                           │                         │ │
      │                           │<────────────────────────┘ │
      │  Invoice email            │                           │
      │  & WhatsApp sent          │                           │
      ├──────────────────────────>│ Save order info           │
      │                           ├──────────────────────────>│
      │  Redirect to              │                           │
      │  /my-orders               │                           │
      │<──────────────────────────┤                           │
      │                           │                           │


╔════════════════════════════════════════════════════════════════════════╗
║                     PRODUCT PAGE JOURNEY                                ║
╚════════════════════════════════════════════════════════════════════════╝

     USER                      FRONTEND                    BACKEND
      │                           │                           │
      │  Visit product page       │                           │
      ├──────────────────────────>│ Fetch product details     │
      │                           ├──────────────────────────>│
      │                           │<──────────────────────────┤
      │                           │                           │
      │  📍 EVENT 1: ViewContent  │                           │
      │                           │ trackMetaPixelViewContent │
      │                           │ (Product name, price)     │
      │                           │                           │
      │  Click "Add to Cart"      │                           │
      ├──────────────────────────>│                           │
      │                           │ 📍 EVENT 2: AddToCart     │
      │                           │ trackMetaPixelAddToCart   │
      │                           │ (Item ID, price)          │
      │                           │                           │
      │                           │ ✅ "Added to cart"        │
      │<──────────────────────────┤                           │
      │                           │                           │
      │  Click "Buy Now"          │                           │
      ├──────────────────────────>│                           │
      │                           │ Open checkout modal       │
      │                           │                           │
      │                           │ 📍 EVENT 3: CheckoutInit  │
      │                           │ trackMetaPixelInitiate    │
      │                           │ Checkout()                │
      │                           │                           │
      │  Fill shipping info       │                           │
      │  Click "Pay"              │                           │
      ├──────────────────────────>│                           │
      │                           │ Create Razorpay order     │
      │                           ├──────────────────────────>│
      │                           │<──────────────────────────┤
      │                           │                           │
      │  Razorpay Modal           │                           │
      │  (Payment)                │                           │
      │                           │                           │
      │  Payment Success          │                           │
      ├──────────────────────────>│                           │
      │                           │ 🎯 EVENT 4: Purchase!    │
      │                           │                           │
      │                           │ trackMetaPixelPurchase(   │
      │                           │   currency: "INR",        │
      │                           │   value: 1499.00,         │
      │                           │   items: [{Product}],     │
      │                           │   transactionId: "xyz789" │
      │                           │ )                         │
      │                           │                           │
      │                           │ window.fbq(               │
      │                           │   "track",                │
      │                           │   "Purchase",             │
      │                           │   { ... }                 │
      │                           │ )                         │
      │                           │                           │
      │                           ├─────────────────────────┐ │
      │                           │                         │ │
      │                           │  📤 DATA SENT TO META   │ │
      │                           │   Transaction ID: xyz789 │ │
      │                           │   Amount: ₹1,499         │ │
      │                           │   Items: [Product]       │ │
      │                           │                         │ │
      │                           │<────────────────────────┘ │
      │  Invoice email            │                           │
      │  & WhatsApp sent          │                           │
      ├──────────────────────────>│                           │
      │                           │                           │
      │  Redirect to /my-orders   │                           │
      │<──────────────────────────┤                           │
      │                           │                           │


╔════════════════════════════════════════════════════════════════════════╗
║                    META PIXEL EVENT STRUCTURE                           ║
╚════════════════════════════════════════════════════════════════════════╝

┌─ Purchase Event Data ─────────────────────────────────────────────────┐
│                                                                        │
│  {                                                                     │
│    currency: "INR",                                                    │
│    value: "1499.00",                                                   │
│    content_name: "Order [payment-id]",                                 │
│    content_ids: ["item-001", "item-002"],                              │
│    content_type: "product",                                            │
│    contents: [                                                         │
│      {                                                                 │
│        id: "item-001",                                                 │
│        title: "Prime Time - Math Strategy Game",                       │
│        quantity: 1,                                                    │
│        delivery_category: "home_delivery"                              │
│      },                                                                │
│      {                                                                 │
│        id: "item-002",                                                 │
│        title: "Logicoland Volume 1",                                   │
│        quantity: 2,                                                    │
│        delivery_category: "home_delivery"                              │
│      }                                                                 │
│    ]                                                                   │
│  }                                                                     │
│                                                                        │
└────────────────────────────────────────────────────────────────────────┘


╔════════════════════════════════════════════════════════════════════════╗
║                    CODE IMPLEMENTATION MAP                              ║
╚════════════════════════════════════════════════════════════════════════╝

File Structure:
┌─ lib/
│  ├─ gtag-events.ts (Existing - Google Analytics)
│  └─ meta-pixel-events.ts ✨ NEW ✨
│
├─ app/
│  ├─ cart/
│  │  └─ page.tsx (Updated ✏️)
│  │     └─ Payment handler
│  │        └─ trackMetaPixelPurchase() 🎯
│  │
│  └─ products/
│     └─ [id]/
│        └─ page.tsx (Updated ✏️)
│           ├─ ProductSection
│           │  └─ handleAddToCart()
│           │     └─ trackMetaPixelAddToCart() 📍
│           │
│           ├─ CheckoutModal
│           │  └─ handleCheckout()
│           │     └─ trackMetaPixelPurchase() 🎯
│           │
│           └─ trackMetaPixelViewContent() 📍

Export Functions in meta-pixel-events.ts:
├─ trackMetaPixelPurchase() 🎯 [CONVERSION]
├─ trackMetaPixelAddToCart() 📍 [Action]
├─ trackMetaPixelViewContent() 📍 [View]
├─ trackMetaPixelInitiateCheckout() 📍 [Action]
└─ trackMetaPixelCustomEvent() 📋 [Custom]


╔════════════════════════════════════════════════════════════════════════╗
║                    VERIFICATION CHECKLIST                              ║
╚════════════════════════════════════════════════════════════════════════╝

Testing Purchase Events:

1️⃣  Cart Page Purchase
   ├─ Navigate to /cart with items
   ├─ Click "Proceed to Checkout"
   ├─ Fill in all details
   ├─ Complete payment
   └─ ✅ Check Meta Events Manager for Purchase event

2️⃣  Product Page Purchase
   ├─ Navigate to /products/[id]
   ├─ (ViewContent event fires)
   ├─ Click "Add to Cart"
   ├─ (AddToCart event fires)
   ├─ Click "Buy Now"
   ├─ (InitiateCheckout event fires)
   ├─ Fill in details
   ├─ Complete payment
   └─ ✅ Check Meta Events Manager for Purchase event

3️⃣  Browser Verification
   ├─ Open DevTools Console (F12)
   ├─ Type: window.fbq
   ├─ Should show: ƒ fbq(...)
   └─ Check Network tab for Meta pixel calls

4️⃣  Meta Pixel Helper (Chrome Extension)
   ├─ Install extension from Chrome Web Store
   ├─ Click extension icon
   ├─ Complete a purchase
   ├─ Look for "Purchase" in events list
   ├─ Verify data: amount, currency, items
   └─ ✅ All correct = Implementation Success!


╔════════════════════════════════════════════════════════════════════════╗
║                    EVENT TIMING DIAGRAM                                ║
╚════════════════════════════════════════════════════════════════════════╝

Cart Page Timeline:
─────────────────

T0:  User loads /cart
     │
     ├─ Cart items displayed
     │
T1:  Click "Proceed to Checkout"
     │
     ├─ Checkout modal opens
     │
T2:  Enter shipping details
     │
T3:  Click "Pay" button
     │
     ├─ Razorpay order created (API call)
     ├─ Razorpay modal opens
     │
T4:  User completes payment
     │
     ├─ Payment gateway returns success
     │
T5:  🎯 FIRE META PIXEL PURCHASE EVENT
     │
     ├─ trackMetaPixelPurchase()
     ├─ window.fbq("track", "Purchase", {...})
     │
T6:  Save order to database
     │
T7:  Send email & WhatsApp
     │
T8:  Redirect to /my-orders

Duration: T0 → T5 = Event fires immediately after payment success
Network: Async call - doesn't block user experience


Product Page Timeline:
────────────────────

T0:  User loads /products/[id]
     │
     ├─ 📍 trackMetaPixelViewContent() [Fires immediately]
     │   └─ User viewed this product
     │
T1:  User clicks "Add to Cart"
     │
     ├─ 📍 trackMetaPixelAddToCart() [Fires immediately]
     │   └─ User added item to cart
     │
T2:  User clicks "Buy Now"
     │
     ├─ 📍 trackMetaPixelInitiateCheckout() [Fires immediately]
     │   └─ User started checkout
     │
T3:  Checkout modal opens
     │
T4:  User completes payment
     │
     ├─ 🎯 trackMetaPixelPurchase() [Fires immediately]
     │   └─ User purchased item [CONVERSION!]
     │
T5:  Save order to database
     │
T6:  Send email & WhatsApp
     │
T7:  Redirect to /my-orders

Duration: T0 → T1 = ~1 second
Duration: T2 → T4 = ~30-60 seconds
Duration: T4 → T5 = Event fires instantly


╔════════════════════════════════════════════════════════════════════════╗
║                    SUCCESS INDICATORS                                  ║
╚════════════════════════════════════════════════════════════════════════╝

✅ Implementation Successful When:

1. Console shows no errors
2. Meta Events Manager shows "Purchase" events
3. Event data includes:
   - ✅ Currency: INR
   - ✅ Value: Correct amount (2 decimals)
   - ✅ Content IDs: Product IDs
   - ✅ Content Type: "product"
   - ✅ Items data: title, quantity
   - ✅ Content Name: Order [Payment-ID]

4. Meta Pixel Helper shows Purchase event
5. Events appear in real-time (within 30 seconds)
6. Multiple test purchases show up in dashboard


───────────────────────────────────────────────────────────────────────────
Generated: November 25, 2025
Status: ✅ Implementation Complete
───────────────────────────────────────────────────────────────────────────
```
