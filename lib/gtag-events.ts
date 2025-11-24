/**
 * Google Analytics Event Tracking Utilities
 * Use these functions to track user interactions across the app
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track page view event
 * @param page_path - The path of the page (e.g., '/products/123')
 * @param page_title - Optional title of the page
 */
export const trackPageView = (page_path: string, page_title?: string) => {
  if (!window.gtag) return;
  window.gtag("event", "page_view", {
    page_path,
    page_title: page_title || document.title,
  });
};

/**
 * Track view_item event (when user views a product)
 * @param item_id - Product/item ID
 * @param item_name - Product name
 * @param price - Product price
 * @param currency - Currency code (e.g., 'INR')
 */
export const trackViewItem = (
  item_id: string,
  item_name: string,
  price: number | string,
  currency: string = "INR"
) => {
  if (!window.gtag) return;
  window.gtag("event", "view_item", {
    currency,
    items: [
      {
        item_id,
        item_name,
        price,
      },
    ],
  });
};

/**
 * Track add_to_cart event
 * @param item_id - Product/item ID
 * @param item_name - Product name
 * @param price - Product price
 * @param quantity - Quantity added (default 1)
 * @param currency - Currency code (e.g., 'INR')
 */
export const trackAddToCart = (
  item_id: string,
  item_name: string,
  price: number | string,
  quantity: number = 1,
  currency: string = "INR"
) => {
  if (!window.gtag) return;
  window.gtag("event", "add_to_cart", {
    currency,
    value: (Number(price) * quantity).toFixed(2),
    items: [
      {
        item_id,
        item_name,
        price,
        quantity,
      },
    ],
  });
};

/**
 * Track remove_from_cart event
 * @param item_id - Product/item ID
 * @param item_name - Product name
 * @param price - Product price
 * @param quantity - Quantity removed (default 1)
 * @param currency - Currency code (e.g., 'INR')
 */
export const trackRemoveFromCart = (
  item_id: string,
  item_name: string,
  price: number | string,
  quantity: number = 1,
  currency: string = "INR"
) => {
  if (!window.gtag) return;
  window.gtag("event", "remove_from_cart", {
    currency,
    value: (Number(price) * quantity).toFixed(2),
    items: [
      {
        item_id,
        item_name,
        price,
        quantity,
      },
    ],
  });
};

/**
 * Track purchase event (after successful payment)
 * @param transaction_id - Order ID
 * @param items - Array of purchased items
 * @param total - Total purchase amount
 * @param currency - Currency code (e.g., 'INR')
 * @param tax - Tax amount (optional)
 * @param shipping - Shipping cost (optional)
 */
export const trackPurchase = (
  transaction_id: string,
  items: Array<{ item_id: string; item_name: string; price: number | string; quantity: number }>,
  total: number | string,
  currency: string = "INR",
  tax?: number | string,
  shipping?: number | string
) => {
  if (!window.gtag) return;
  window.gtag("event", "purchase", {
    transaction_id,
    currency,
    value: total,
    tax: tax || undefined,
    shipping: shipping || undefined,
    items,
  });
};

/**
 * Track begin_checkout event
 * @param items - Array of items in cart
 * @param value - Total cart value
 * @param currency - Currency code (e.g., 'INR')
 */
export const trackBeginCheckout = (
  items: Array<{ item_id: string; item_name: string; price: number | string; quantity: number }>,
  value: number | string,
  currency: string = "INR"
) => {
  if (!window.gtag) return;
  window.gtag("event", "begin_checkout", {
    currency,
    value,
    items,
  });
};

/**
 * Track custom event
 * @param event_name - Name of the event
 * @param event_data - Event-specific data
 */
export const trackCustomEvent = (event_name: string, event_data?: Record<string, any>) => {
  if (!window.gtag) return;
  window.gtag("event", event_name, event_data || {});
};

/**
 * Track form submission
 * @param form_name - Name/identifier of the form
 * @param form_data - Optional form data to send
 */
export const trackFormSubmit = (form_name: string, form_data?: Record<string, any>) => {
  if (!window.gtag) return;
  window.gtag("event", "form_submit", {
    form_name,
    ...form_data,
  });
};

/**
 * Track button click
 * @param button_name - Name/label of the button
 * @param button_location - Location on page (optional)
 */
export const trackButtonClick = (button_name: string, button_location?: string) => {
  if (!window.gtag) return;
  window.gtag("event", "button_click", {
    button_name,
    button_location: button_location || "unknown",
  });
};

/**
 * Track sign up event
 * @param method - Sign up method (e.g., 'email', 'google', 'facebook')
 */
export const trackSignUp = (method: string) => {
  if (!window.gtag) return;
  window.gtag("event", "sign_up", {
    method,
  });
};

/**
 * Track login event
 * @param method - Login method (e.g., 'email', 'google', 'facebook')
 */
export const trackLogin = (method: string) => {
  if (!window.gtag) return;
  window.gtag("event", "login", {
    method,
  });
};

/**
 * Track search event
 * @param search_term - What the user searched for
 */
export const trackSearch = (search_term: string) => {
  if (!window.gtag) return;
  window.gtag("event", "search", {
    search_term,
  });
};

/**
 * Track exception/error
 * @param description - Error description
 * @param fatal - Whether the error is fatal (optional)
 */
export const trackException = (description: string, fatal: boolean = false) => {
  if (!window.gtag) return;
  window.gtag("event", "exception", {
    description,
    fatal,
  });
};
