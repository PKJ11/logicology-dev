# Quick Testing Guide - GA Events

## 🧪 Instant Test (Copy & Paste in Browser Console)

```javascript
// 1. Check if GA is loaded
console.log("GA Status:", {
  gtag_exists: !!window.gtag,
  dataLayer_length: window.dataLayer ? window.dataLayer.length : 0
});

// 2. Fire a test event
window.gtag("event", "test_event", {
  test_parameter: "hello from console"
});

// 3. Watch for the event in dataLayer
console.log("Recent events:", window.dataLayer.slice(-5));
```

---

## ✅ What You Should See (After Fixes)

### **In Browser Console:**
```
GA Status: {
  gtag_exists: true,          ← Should be TRUE
  dataLayer_length: 5         ← Should be > 0
}

Recent events: [
  ["js", Date],
  ["config", "G-E580K4QQ3Q", {...}],
  ["event", "test_event", {...}]
]
```

### **In Analytics DebugView:**
- ✅ Your device shows as "1 active user"
- ✅ Events tab shows "test_event"
- ✅ Each user action creates new event

---

## 🔍 Real Flow Test

**1. Product Page Event**
```
Navigate to: https://www.logicology.in/products/[productId]
Expected: page_view + view_item events fire
Check: DebugView shows both events
```

**2. Add to Cart Event**
```
Click "Add to cart" button
Expected: add_to_cart event fires
Check: DebugView shows event with product details
```

**3. Checkout Event**
```
Click "Proceed to Checkout"
Expected: begin_checkout event fires
Check: DebugView shows event with cart items
```

**4. Purchase Event**
```
Complete payment
Expected: purchase event fires
Check: DebugView shows revenue + items
```

---

## 📊 Analytics Dashboard

**Real-time Data:**
- Go: https://analytics.google.com → Logicology → Realtime
- Should show: "1 user" + event list

**Events Report:**
- Go: Admin → Events
- Should show custom events we created:
  - page_view
  - view_item
  - add_to_cart
  - purchase
  - feedback_submission
  - cta_click

---

## ⚠️ If Events Still Don't Show

**Check 1: GA Script Loaded**
```javascript
// In Network tab, search for:
// - gtag/js?id=G-E580K4QQ3Q (should be 200 OK)
// - www.google-analytics.com/collect (events sent)
```

**Check 2: GA Provider Active**
```javascript
// In Console:
import { isGALoaded } from "@/lib/gtag";
console.log("GA Loaded:", isGALoaded());  // Should be true
```

**Check 3: Manual Event Fire**
```javascript
// Force trigger an event
window.gtag("event", "manual_test", {param: "test"});

// Check dataLayer updated
console.log(window.dataLayer);
```

---

## 💡 Pro Tips

1. **Events appear in DebugView within seconds**
2. **Full reports update every 24-48 hours**
3. **Use DebugView for real-time testing**
4. **Each browser/device = separate session**
5. **Clear browser cache if not seeing updates**

---

**Status After Fixes:** ✅ All events should now fire properly!
