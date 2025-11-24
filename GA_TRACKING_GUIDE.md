# Google Analytics Event Tracking Guide

This guide explains how to track user interactions on the Logicology app using Google Analytics (GA4).

## Setup Overview

- **GA Measurement ID**: `G-V56MW94G3L`
- **Initialization**: Done in `app/layout.tsx` (gtag script + initialization)
- **SPA Page Views**: Handled automatically by `components/Analytics.tsx`
- **Event Tracking**: Use utilities from `lib/gtag-events.ts`

## Quick Start

### 1. Import the tracking utilities in your component

```tsx
import { trackAddToCart, trackViewItem, trackPurchase, trackCustomEvent } from "@/lib/gtag-events";
```

### 2. Call tracking functions on user actions

```tsx
// When user views a product
trackViewItem("product-123", "Prime Time Board Game", 1499, "INR");

// When user adds to cart
trackAddToCart("product-123", "Prime Time Board Game", 1499, 1, "INR");

// When user completes purchase
trackPurchase(
  "order-456",
  [
    { item_id: "product-123", item_name: "Prime Time", price: 1499, quantity: 1 },
    { item_id: "product-789", item_name: "Logicoland Vol 1", price: 249, quantity: 2 },
  ],
  2097,
  "INR"
);
```

---

## Available Tracking Functions

### Page Views
Automatically tracked by `Analytics.tsx` on route changes. No action needed.

### Product Tracking

#### `trackViewItem(item_id, item_name, price, currency)`
Track when a user views a product.

```tsx
trackViewItem("item_RNn1BJlJAJ9sM8", "Prime Time", 1499, "INR");
```

#### `trackAddToCart(item_id, item_name, price, quantity, currency)`
Track when an item is added to cart.

```tsx
trackAddToCart(
  "item_RNn1BJlJAJ9sM8",
  "Prime Time",
  1499,
  1,
  "INR"
);
```

#### `trackRemoveFromCart(item_id, item_name, price, quantity, currency)`
Track when an item is removed from cart.

```tsx
trackRemoveFromCart(
  "item_RNn1BJlJAJ9sM8",
  "Prime Time",
  1499,
  1,
  "INR"
);
```

### Checkout Tracking

#### `trackBeginCheckout(items, value, currency)`
Track when user starts checkout.

```tsx
trackBeginCheckout(
  [
    { item_id: "product-1", item_name: "Prime Time", price: 1499, quantity: 1 },
    { item_id: "product-2", item_name: "Logicoland", price: 249, quantity: 2 },
  ],
  2097,
  "INR"
);
```

#### `trackPurchase(transaction_id, items, total, currency, tax, shipping)`
Track a completed purchase (call after successful payment).

```tsx
trackPurchase(
  "ORDER-123456",
  [
    { item_id: "product-1", item_name: "Prime Time", price: 1499, quantity: 1 },
  ],
  1499,
  "INR",
  0,      // tax
  0       // shipping
);
```

### User Actions

#### `trackSignUp(method)`
Track user sign up (pass the method: email, google, facebook, etc.).

```tsx
trackSignUp("email");
trackSignUp("google");
```

#### `trackLogin(method)`
Track user login.

```tsx
trackLogin("email");
```

#### `trackSearch(search_term)`
Track search queries.

```tsx
trackSearch("board games");
```

### Form & Button Tracking

#### `trackFormSubmit(form_name, form_data)`
Track form submissions (feedback, contact, etc.).

```tsx
import { trackFormSubmit } from "@/lib/gtag-events";

const handleSubmit = (e) => {
  e.preventDefault();
  // ... form processing ...
  trackFormSubmit("feedback_form", {
    category: "product_feedback",
    rating: 5,
  });
};
```

#### `trackButtonClick(button_name, button_location)`
Track button clicks for important CTAs.

```tsx
const handleBuyClick = () => {
  trackButtonClick("add_to_cart", "product_page_hero");
  // ... add to cart logic ...
};
```

### Custom Events

#### `trackCustomEvent(event_name, event_data)`
Track any custom event.

```tsx
trackCustomEvent("video_played", {
  video_id: "promo-123",
  video_title: "How to Play Prime Time",
});
```

### Error Tracking

#### `trackException(description, fatal)`
Track errors/exceptions.

```tsx
try {
  // risky operation
} catch (error) {
  trackException(`Payment failed: ${error.message}`, false);
}
```

---

## Practical Examples

### Example 1: Product Page Component

```tsx
"use client";

import { useEffect } from "react";
import { trackViewItem, trackAddToCart, trackButtonClick } from "@/lib/gtag-events";

export default function ProductPage({ product }) {
  // Track page view on mount
  useEffect(() => {
    trackViewItem(product.razorpayItemId, product.name, product.price, "INR");
  }, [product]);

  const handleAddToCart = () => {
    trackButtonClick("add_to_cart_btn", "product_page");
    trackAddToCart(
      product.razorpayItemId,
      product.name,
      product.price,
      1,
      "INR"
    );
    // ... actual add to cart logic ...
  };

  return (
    <div>
      <h1>{product.name}</h1>
      <p>Price: {product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

### Example 2: Cart Component

```tsx
"use client";

import { trackRemoveFromCart, trackBeginCheckout } from "@/lib/gtag-events";

export default function CartPage({ items }) {
  const handleRemove = (item) => {
    trackRemoveFromCart(item.id, item.name, item.price, item.quantity, "INR");
    // ... remove from cart logic ...
  };

  const handleCheckout = () => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    trackBeginCheckout(
      items.map((item) => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      total,
      "INR"
    );
    // ... redirect to checkout ...
  };

  return (
    <div>
      {items.map((item) => (
        <div key={item.id}>
          <p>{item.name}</p>
          <button onClick={() => handleRemove(item)}>Remove</button>
        </div>
      ))}
      <button onClick={handleCheckout}>Proceed to Checkout</button>
    </div>
  );
}
```

### Example 3: Feedback Form Component

```tsx
"use client";

import { useState } from "react";
import { trackFormSubmit, trackButtonClick } from "@/lib/gtag-events";

export default function FeedbackForm() {
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Track form submission
    trackFormSubmit("feedback_form", {
      rating,
      feedback_length: feedback.length,
    });

    // Send to backend
    await fetch("/api/feedback", {
      method: "POST",
      body: JSON.stringify({ feedback, rating }),
    });

    setFeedback("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Your feedback..."
      />
      <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
        <option value={1}>1 - Poor</option>
        <option value={5}>5 - Excellent</option>
      </select>
      <button type="submit">Submit Feedback</button>
    </form>
  );
}
```

### Example 4: Login Component

```tsx
"use client";

import { trackLogin, trackException } from "@/lib/gtag-events";

export default function LoginForm() {
  const handleLogin = async (email, password) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        trackLogin("email");
        // ... redirect to dashboard ...
      } else {
        trackException("Login failed: Invalid credentials", false);
      }
    } catch (error) {
      trackException(`Login error: ${error.message}`, false);
    }
  };

  return (
    // ... login form JSX ...
  );
}
```

---

## Viewing Events in Google Analytics

### Real-time Reporting
1. Go to Google Analytics (analytics.google.com)
2. Select your property (Logicology)
3. Go to Reports → Realtime → Overview
4. You'll see events sent from your site in real time

### Event Reports
1. Reports → Events → [Event name]
2. View event count, user engagement, etc.

### Custom Dashboards
Create dashboards with event metrics for quick monitoring.

---

## Best Practices

1. **Use meaningful names**: Event names should be clear and descriptive.
2. **Add context**: Pass relevant data (item IDs, categories, etc.) with events.
3. **Track conversions**: Always track key business events (purchases, sign-ups, etc.).
4. **Avoid over-tracking**: Not every click needs tracking, focus on business metrics.
5. **Test before production**: Use GA DebugView extension or set `debug_mode: true` temporarily.
6. **Remove debug mode**: Don't commit `debug_mode: true` to production.
7. **Handle privacy**: Consider GDPR/privacy; gate tracking behind user consent if required.

---

## Troubleshooting

### Events not appearing in GA?

1. **Check Network tab**: Open DevTools → Network → filter `collect` or `g/collect`
   - Should see POST requests to `google-analytics.com/g/collect`
   - Status should be `204 No Content`

2. **Verify gtag is loaded**:
   ```js
   console.log(typeof window.gtag);  // should be "function"
   ```

3. **Check for adblockers**: Disable ad blockers or use incognito window.

4. **Realtime reporting**: Check GA Realtime (analytics.google.com) to see events immediately.

5. **Debug mode**: Temporarily add `debug_mode: true` and check DebugView in GA.

---

## Next Steps

1. **Integrate tracking into key user flows**:
   - Add `trackViewItem` to product pages
   - Add `trackAddToCart` to cart buttons
   - Add `trackPurchase` after payment success
   - Add `trackFormSubmit` to forms

2. **Set up GA Goals** (optional):
   - Create conversion goals in GA (purchase, signup, etc.)

3. **Create custom reports** in GA to monitor KPIs.

4. **Set up alerts** for important metrics.

---

For questions or issues, refer to:
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 Implementation Guide](https://developers.google.com/analytics/devguides/collection/ga4)
