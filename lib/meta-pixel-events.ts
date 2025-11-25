/**
 * Meta Pixel Event Tracking Utilities
 * Use these functions to track user interactions for Meta conversion tracking
 */

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

/**
 * Track purchase event on Meta Pixel
 * @param currency - Currency code (e.g., 'INR')
 * @param value - Total purchase amount
 * @param items - Array of purchased items
 * @param transaction_id - Order/payment ID (optional)
 */
export const trackMetaPixelPurchase = (
  currency: string = "INR",
  value: number | string,
  items?: Array<{
    title?: string;
    item_id?: string;
    price?: number | string;
    quantity?: number;
    category?: string;
  }>,
  transaction_id?: string
) => {
  if (!window.fbq) {
    console.warn("Meta Pixel (fbq) not loaded");
    return;
  }

  const eventData: any = {
    currency: currency.toUpperCase(),
    value: Number(value).toFixed(2),
  };

  // Add transaction ID if provided
  if (transaction_id) {
    eventData.content_name = `Order ${transaction_id}`;
  }

  // Add items content array if provided
  if (items && items.length > 0) {
    eventData.content_ids = items.map((item) => item.item_id || item.title || "");
    eventData.content_type = "product";
    eventData.contents = items.map((item) => ({
      id: item.item_id || item.title || "",
      title: item.title || "",
      quantity: item.quantity || 1,
      delivery_category: "home_delivery",
    }));
  }

  window.fbq("track", "Purchase", eventData);
};

/**
 * Track add to cart event on Meta Pixel
 * @param currency - Currency code (e.g., 'INR')
 * @param value - Item/total value
 * @param items - Array of items added
 */
export const trackMetaPixelAddToCart = (
  currency: string = "INR",
  value: number | string,
  items?: Array<{
    title?: string;
    item_id?: string;
    price?: number | string;
    quantity?: number;
  }>
) => {
  if (!window.fbq) {
    console.warn("Meta Pixel (fbq) not loaded");
    return;
  }

  const eventData: any = {
    currency: currency.toUpperCase(),
    value: Number(value).toFixed(2),
  };

  if (items && items.length > 0) {
    eventData.content_ids = items.map((item) => item.item_id || item.title || "");
    eventData.content_type = "product";
    eventData.contents = items.map((item) => ({
      id: item.item_id || item.title || "",
      title: item.title || "",
      quantity: item.quantity || 1,
    }));
  }

  window.fbq("track", "AddToCart", eventData);
};

/**
 * Track view content event on Meta Pixel (product view)
 * @param currency - Currency code (e.g., 'INR')
 * @param value - Product price
 * @param items - Product details
 */
export const trackMetaPixelViewContent = (
  currency: string = "INR",
  value: number | string,
  items?: Array<{
    id?: string;
    title?: string;
    category?: string;
    price?: number | string;
  }>
) => {
  if (!window.fbq) {
    console.warn("Meta Pixel (fbq) not loaded");
    return;
  }

  const eventData: any = {
    currency: currency.toUpperCase(),
    value: Number(value).toFixed(2),
  };

  if (items && items.length > 0) {
    eventData.content_ids = items.map((item) => item.id || item.title || "");
    eventData.content_type = "product";
    eventData.contents = items.map((item) => ({
      id: item.id || item.title || "",
      title: item.title || "",
      category: item.category || "Product",
    }));
  }

  window.fbq("track", "ViewContent", eventData);
};

/**
 * Track initiate checkout event on Meta Pixel
 * @param currency - Currency code (e.g., 'INR')
 * @param value - Total cart value
 * @param num_items - Number of items in cart
 */
export const trackMetaPixelInitiateCheckout = (
  currency: string = "INR",
  value: number | string,
  num_items?: number
) => {
  if (!window.fbq) {
    console.warn("Meta Pixel (fbq) not loaded");
    return;
  }

  const eventData: any = {
    currency: currency.toUpperCase(),
    value: Number(value).toFixed(2),
  };

  if (num_items) {
    eventData.num_items = num_items;
  }

  window.fbq("track", "InitiateCheckout", eventData);
};

/**
 * Track custom event on Meta Pixel
 * @param event_name - Event name
 * @param event_data - Event data
 */
export const trackMetaPixelCustomEvent = (event_name: string, event_data?: Record<string, any>) => {
  if (!window.fbq) {
    console.warn("Meta Pixel (fbq) not loaded");
    return;
  }

  window.fbq("track", event_name, event_data || {});
};
