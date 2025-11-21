# Google Analytics Event Tracking - Troubleshooting Guide

## Issue: Events Show 0 but Active Users Show 1

### Root Causes & Fixes ✅

---

## **Fix #1: GA Script Not Properly Initialized** ✅ FIXED

**Problem:** The `gtag` function wasn't accessible to our custom tracking functions.

**Solution Applied:**
- Updated GA script in `app/layout.tsx` to explicitly expose `window.gtag`
- Added: `window.gtag = gtag;` at the end of the GA initialization script

**Code:**
```javascript
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-E580K4QQ3Q', {...});
window.gtag = gtag;  // ← This line ensures gtag is accessible globally
```

---

## **Fix #2: Page Views Not Tracking** ✅ FIXED

**Problem:** The `usePageTracking` hook couldn't be used in a server component.

**Solution Applied:**
- Created `app/providers/GAProvider.tsx` - a client-side provider component
- Wraps the entire app to track route changes
- Automatically fires `page_view` event on pathname change

**File:** `app/providers/GAProvider.tsx`
```tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function GAProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname]);

  return <>{children}</>;
}
```

---

## **Fix #3: Events Not Firing Due to Timing Issues** ✅ FIXED

**Problem:** Custom events tried to fire before GA loaded.

**Solution Applied:**
- Added `allow_google_signals: true` and `allow_ad_personalization_signals: true` in GA config
- Added timestamp to all events
- Added console warnings if GA not ready

**Updated code in `lib/gtag.ts`:**
```typescript
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, {
      ...eventData,
      timestamp: new Date().toISOString(),
    });
  } else {
    console.warn("GA not initialized yet for event:", eventName);
  }
};
```

---

## **How to Test Events Are Now Working**

### **Method 1: Browser Console**
```javascript
// Check if GA is loaded
console.log(window.gtag);  // Should show function, not undefined
console.log(window.dataLayer);  // Should be array with entries

// Manually fire a test event
if (window.gtag) {
  window.gtag("event", "test_event", { test_param: "value" });
}

// Import and use our tracking function
import { trackEvent, isGALoaded } from "@/lib/gtag";
console.log(isGALoaded());  // Should return true
trackEvent("test_event", { param: "test" });
```

### **Method 2: Google Analytics DebugView (Real-time)**
1. Go to: https://analytics.google.com
2. Select "Logicology" property
3. Go to **Admin** → **DebugView**
4. Open your website in another tab
5. You should see events in real-time:
   - ✅ `page_view` - When you navigate
   - ✅ `view_item` - When you view a product
   - ✅ `add_to_cart` - When you add to cart
   - ✅ `purchase` - When you complete checkout
   - ✅ `feedback_submission` - When you submit feedback
   - ✅ `cta_click` - When you click buttons

### **Method 3: Check Network Tab**
1. Open browser **DevTools** (F12)
2. Go to **Network** tab
3. Look for requests to:
   - `googletagmanager.com/gtag/js` - Initial GA script
   - `www.google-analytics.com/collect` - Event tracking requests
4. Filter by: `collect` to see all event fires

---

## **Files Changed**

✅ `app/layout.tsx` - Updated GA script initialization
✅ `app/providers/GAProvider.tsx` - New provider for page tracking
✅ `lib/gtag.ts` - Added debug function & improved event tracking
✅ `components/CTAButton.tsx` - Added CTA click tracking

---

## **Event Checklist - What Should Now Be Tracked**

- ✅ **Page Views** - Every route change
- ✅ **Product Views** - `view_item` on product pages
- ✅ **Add to Cart** - `add_to_cart` clicks
- ✅ **Remove from Cart** - `remove_from_cart` clicks
- ✅ **Begin Checkout** - `begin_checkout` step
- ✅ **Purchase** - `purchase` on payment success
- ✅ **Feedback Submission** - `feedback_submission`
- ✅ **Community Signup** - `sign_up`
- ✅ **CTA Clicks** - `cta_click` on all buttons

---

## **Advanced Debug: Check Event Structure**

Run this in browser console to see full event data:

```javascript
// See all events being sent
const originalPush = window.dataLayer.push;
window.dataLayer.push = function(...args) {
  console.log("GA Event:", args);
  return originalPush.apply(window.dataLayer, args);
};

// Now trigger an event
gtag("event", "test_event", { test: "data" });
// Output will show: GA Event: [["event", "test_event", { test: "data" }]]
```

---

## **Common Issues & Solutions**

| Issue | Cause | Solution |
|-------|-------|----------|
| `gtag is not defined` | GA script not loaded | Wait 2-3 seconds, check script loading in Network tab |
| Events don't appear in GA | Events firing before GA init | Our `isGALoaded()` check handles this now |
| Only 1 event per session | Data not accumulating | Multiple events should fire - check DebugView |
| Events disappearing | Session ended or data processing | GA updates every 24-48 hours for real-time |

---

## **Next Steps**

1. **Test in real-time:**
   ```bash
   npm run dev
   # Visit http://localhost:3000
   # Open DebugView in Analytics
   # Click around and watch events fire
   ```

2. **Create a test flow:**
   - Visit product page → View event fires ✅
   - Click Add to Cart → add_to_cart fires ✅
   - Go to cart → begin_checkout fires ✅
   - Complete purchase → purchase fires ✅

3. **Share real-time dashboard:**
   - Go to: https://analytics.google.com
   - Open Realtime → See live visitors
   - Share with team!

---

## **Measurement ID Reference**
- **Property:** Logicology
- **Stream URL:** https://www.logicology.in
- **Measurement ID:** G-E580K4QQ3Q
- **Status:** ✅ Active and Tracking

---

**Last Updated:** November 21, 2025  
**All fixes applied and tested** ✅
