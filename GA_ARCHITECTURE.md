# Google Analytics Architecture - Logicology

## 🏗️ Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser/Website User                     │
└─────────────────────────────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │    app/layout.tsx (Root Layout)      │
        │                                      │
        │  <Script> → gtag.js (GA Library)    │
        │  Initializes: window.gtag           │
        │  Initializes: window.dataLayer      │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │    GAProvider (Client Component)     │
        │                                      │
        │  Watches: pathname changes           │
        │  Fires: page_view events             │
        │  Wraps: All child components         │
        └──────────────────────────────────────┘
                           │
         ┌─────────────────┴─────────────────┐
         ▼                                   ▼
    ┌────────────┐              ┌──────────────────────┐
    │  CartProvider  │              │  User Interactions   │
    │  App Routes    │              │                      │
    │  Components    │              │  - Click button      │
    └────────────┘              │  - Add to cart       │
         │                       │  - Submit form       │
         │                       │  - Complete purchase │
         │                       └──────────────────────┘
         │                                   │
         └─────────────────┬─────────────────┘
                           ▼
        ┌──────────────────────────────────────┐
        │   lib/gtag.ts (Tracking Functions)   │
        │                                      │
        │  trackEvent()                        │
        │  trackProductView()                  │
        │  trackAddToCart()                    │
        │  trackPurchase()                     │
        │  trackFeedbackSubmission()           │
        │  etc...                              │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │     window.gtag("event", ...)        │
        │     Fires event to Google             │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      www.google-analytics.com         │
        │                                      │
        │  Receives & Processes Events:        │
        │  - Stores in dataLayer               │
        │  - Real-time in DebugView (1-2 sec) │
        │  - Full reports (24-48 hours)        │
        └──────────────────────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │  https://analytics.google.com        │
        │                                      │
        │  ✅ Realtime Dashboard               │
        │  ✅ Events Report                    │
        │  ✅ Conversion Analysis              │
        │  ✅ User Behavior Insights           │
        └──────────────────────────────────────┘
```

---

## 🔄 Event Tracking Flow

```
User Action
    │
    ▼
Component Function
(e.g., handleAddToCart)
    │
    ▼
Call: trackAddToCart(id, name, qty, price)
    │
    ▼
lib/gtag.ts Function
    │
    ├─ Check: window.gtag exists?
    │   YES ✅  →  Continue
    │   NO ❌   →  console.warn()
    │
    ▼
Build Event Data
{
  event_name: "add_to_cart",
  currency: "INR",
  value: 1499,
  items: [{...}],
  timestamp: "2025-11-21T10:30:00Z"
}
    │
    ▼
window.gtag("event", eventName, eventData)
    │
    ▼
Push to window.dataLayer array
    │
    ▼
Send to Google Analytics
    │
    ▼
✅ Event Recorded
```

---

## 📊 Pages & Events Tracking

```
ROOT (app/layout.tsx)
  ├─ Google Analytics Script
  │  └─ window.gtag initialized
  │
  └─ GAProvider
     └─ Tracks page_view on route change
        
├─ app/page.tsx
│  └─ page_view ✅
│
├─ app/products/[id]/page.tsx
│  ├─ page_view ✅
│  ├─ view_item (on load) ✅
│  ├─ buy_now_clicked (button) ✅
│  └─ add_to_cart (button) ✅
│
├─ app/cart/page.tsx
│  ├─ page_view ✅
│  ├─ remove_from_cart (button) ✅
│  ├─ begin_checkout (modal) ✅
│  └─ purchase (payment success) ✅
│
├─ app/feedback/page.tsx
│  ├─ page_view ✅
│  └─ feedback_submission (form) ✅
│
├─ app/Community/page.tsx
│  ├─ page_view ✅
│  ├─ sign_up ✅
│  └─ community_access ✅
│
└─ components/CTAButton.tsx
   └─ cta_click (any button) ✅
```

---

## 🔧 Component Structure

```
<html>
  <head>
    {/* GA Script Loads Here */}
    <script src="gtag.js"></script>
  </head>
  <body>
    <GAProvider>  ← Tracks page views
      <CartProvider>
        <Routes>
          <Product />      ← Tracks view_item, add_to_cart
          <Cart />         ← Tracks purchase, remove_from_cart
          <Feedback />     ← Tracks feedback_submission
          <Community />    ← Tracks sign_up
        </Routes>
      </CartProvider>
    </GAProvider>
  </body>
</html>
```

---

## 🧪 Testing & Debugging

```
Browser Console
     │
     ├─ Check GA Status
     │  └─ console.log(window.gtag)
     │
     ├─ Fire Test Event
     │  └─ gtag("event", "test")
     │
     └─ View Events
        └─ console.log(window.dataLayer)
             │
             ▼
        Network Tab
             │
             ├─ Request: gtag/js?id=G-E580K4QQ3Q
             └─ Request: collect?v=1... (events)
                  │
                  ▼
            Analytics DebugView
                  │
                  ├─ Real-time events (1-2 sec)
                  ├─ Event details
                  └─ Active user count
                       │
                       ▼
                 Full Reports (24-48 hrs)
                       │
                       ├─ Realtime Dashboard
                       ├─ Events Report
                       ├─ Conversion Analysis
                       └─ User Behavior
```

---

## 🔗 Key Files & Connections

```
lib/gtag.ts
  ├─ Imports: None (pure functions)
  └─ Exports: 
      ├─ trackEvent()
      ├─ trackProductView()
      ├─ trackAddToCart()
      ├─ trackRemoveFromCart()
      ├─ trackPurchase()
      ├─ trackFeedbackSubmission()
      ├─ trackSignUp()
      ├─ trackCTAClick()
      └─ isGALoaded() (debug)
           │
           └─ Used By:
              ├─ app/products/[id]/page.tsx
              ├─ app/cart/page.tsx
              ├─ app/feedback/page.tsx
              ├─ app/Community/page.tsx
              ├─ components/CTAButton.tsx
              └─ app/providers/GAProvider.tsx
```

---

## ✅ Verification Checklist

- ✅ GA Script loads (status: `200 OK`)
- ✅ `window.gtag` function exists
- ✅ `window.dataLayer` array populated
- ✅ GAProvider wraps app
- ✅ Page view fires on route change
- ✅ Custom events fire on user actions
- ✅ Events appear in DebugView (1-2 sec)
- ✅ Events appear in reports (24-48 hrs)

---

**Measurement ID:** G-E580K4QQ3Q  
**Implementation Status:** ✅ Complete & Functional
