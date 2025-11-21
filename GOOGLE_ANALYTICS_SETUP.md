# Google Analytics Implementation Guide for Logicology

## ✅ Setup Complete

### **Measurement ID**: G-E580K4QQ3Q

**Stream Name**: Logicology  
**Stream URL**: https://www.logicology.in

---

## 📊 Events Implemented Across Your Website

### **1. Product Page (`app/products/[id]/page.tsx`)**

- **`view_item`** - Automatically triggered when user views a product
  - Tracks: Product ID, Product Name, Price, Category
  - Helps understand: Which products attract users

- **`add_to_cart`** - When user clicks "Add to cart"
  - Tracks: Product ID, Name, Quantity, Price
  - Helps understand: Product conversion rates

- **`buy_now_clicked`** - When user clicks "Buy Now"
  - Tracks: Product ID, Name, Price
  - Helps understand: Purchase intent

### **2. Shopping Cart (`app/cart/page.tsx`)**

- **`begin_checkout`** - When user starts checkout process
  - Tracks: Total value, Coupon/Promo code, All items in cart
  - Helps understand: Cart abandonment rate

- **`remove_from_cart`** - When user removes item from cart
  - Tracks: Product ID, Name, Quantity, Price
  - Helps understand: Which products are being removed

- **`purchase`** - When payment is successfully completed
  - Tracks: Order ID, Total amount, All purchased items, User email
  - Helps understand: Revenue, AOV, top-selling products

### **3. Feedback Page (`app/feedback/page.tsx`)**

- **`feedback_submission`** - When user submits feedback
  - Tracks: Feedback type, User email
  - Helps understand: User engagement and satisfaction

### **4. Community Page (`app/Community/page.tsx`)**

- **`sign_up`** - When user accesses community (authenticated)
  - Tracks: Sign-up method, User email
  - Helps understand: Community growth

- **`community_access`** - When user accesses community portal
  - Tracks: User email, User name
  - Helps understand: Active community members

### **5. CTA Button Component (`components/CTAButton.tsx`)**

- **`cta_click`** - When any CTA button is clicked
  - Tracks: CTA name, Button text, URL (if external)
  - Helps understand: Which CTAs drive engagement

---

## 🔧 Custom Event Tracking Functions Available

You can use these functions anywhere in your app:

```typescript
import {
  trackEvent,
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackPurchase,
  trackSearch,
  trackFormSubmission,
  trackSignUp,
  trackLogin,
  trackContactFormSubmission,
  trackFeedbackSubmission,
  trackCommunityJoin,
  trackLinkClick,
  trackVideoPlay,
  trackBulkOrderInitiation,
  trackPromoCodeUsed,
  trackScrollDepth,
  trackCTAClick,
} from "@/lib/gtag";

// Example usage:
trackProductView("product-123", "Prime Time Game", 1499, "games");
trackAddToCart("product-123", "Prime Time Game", 1, 1499);
trackEvent("custom_event_name", { custom_param: "value" });
```

---

## 📈 Automatic Tracking

### **Page Views**

- Automatically tracked on every route change using the page router
- No manual action needed

### **Session Information**

- User ID (if available)
- Session duration
- Device and browser info
- Geographic location

---

## 🎯 Recommended Additional Events to Add

### **For Bulk Orders**

```typescript
import { trackBulkOrderInitiation } from "@/lib/gtag";

// In bulk order page
trackBulkOrderInitiation(userEmail);
```

### **For Promo Codes**

```typescript
import { trackPromoCodeUsed } from "@/lib/gtag";

// When promo code is applied
trackPromoCodeUsed("PROMO2025", 500); // discount amount
```

### **For Video Engagement**

```typescript
import { trackVideoPlay } from "@/lib/gtag";

// In video components
trackVideoPlay("Product Demo Video", videoUrl);
```

### **For Contact Form**

```typescript
import { trackContactFormSubmission } from "@/lib/gtag";

// In contact form
trackContactFormSubmission(userEmail, phoneNumber);
```

---

## 📍 How to View Your Analytics

### **Real-time Dashboard**

1. Go to: https://analytics.google.com
2. Log in with your account
3. Select "Logicology" property
4. Click **Realtime** to see live traffic

### **Events Tab**

1. Go to: https://analytics.google.com
2. Navigation → **Events**
3. See all custom events being tracked
4. Filter by date, event name, etc.

### **Conversion Tracking**

1. Navigate to **Admin** → **Conversions**
2. Mark important events as conversions:
   - `purchase` (Sales)
   - `begin_checkout` (Add to cart)
   - `feedback_submission` (Engagement)

### **Audience Insights**

1. Go to **Explore** tab
2. Create reports showing:
   - User behavior by product
   - Conversion funnel
   - Cart abandonment analysis

---

## 🔍 Testing Events

### **Using Google Analytics DebugView**

1. Go to https://analytics.google.com
2. Select your property
3. Go to **Admin** → **DebugView**
4. Visit your website - you'll see events in real-time

### **Using Browser Console**

```javascript
// Check if GA is loaded
console.log(window.gtag);

// Manually fire an event
gtag("event", "test_event", {
  test_parameter: "test_value",
});
```

---

## ⚙️ Files Created/Modified

### **Created Files**

- `lib/gtag.ts` - Main GA utility with all tracking functions
- `app/hooks/usePageTracking.ts` - Automatic page view tracking
- `app/hooks/useEventTracking.ts` - Custom event tracking hook

### **Modified Files**

- `app/layout.tsx` - Added GA script initialization
- `app/products/[id]/page.tsx` - Added product view & add-to-cart events
- `app/cart/page.tsx` - Added cart, checkout, and purchase events
- `app/feedback/page.tsx` - Added feedback submission event
- `app/Community/page.tsx` - Added community signup & access events
- `components/CTAButton.tsx` - Added CTA click tracking

---

## 📋 Best Practices for Analytics

1. **Use consistent naming** - Event names should be descriptive (e.g., `buy_now_clicked` not `btn_click`)

2. **Pass meaningful data** - Include product IDs, names, prices, categories whenever possible

3. **Tag your campaigns** - Use UTM parameters in URLs:
   - `?utm_source=email&utm_medium=newsletter&utm_campaign=launch`

4. **Set up conversion goals** - Mark important events as conversions in GA4

5. **Regular reviews** - Check analytics weekly to understand user behavior

6. **Set up alerts** - Enable notifications for unusual traffic patterns

---

## 🚀 Next Steps

1. **Verify events are firing**
   - Check DebugView for events appearing
   - Test all user journeys

2. **Create dashboards**
   - Set up custom dashboards for KPIs
   - Share with stakeholders

3. **Add more events** (Optional)
   - Track specific features unique to your business
   - Monitor user engagement metrics

4. **Optimize conversions**
   - Use data to improve user experience
   - A/B test based on GA insights

---

## 📞 Support

For questions about GA4:

- [Google Analytics 4 Help](https://support.google.com/analytics/answer/10089681)
- [Event Planning Guide](https://support.google.com/analytics/answer/10331785)
- [GA4 Implementation Reference](https://developers.google.com/analytics/devguides/collection/ga4)

---

**Last Updated**: November 21, 2025  
**Measurement ID**: G-E580K4QQ3Q  
**Status**: ✅ Ready for Production
