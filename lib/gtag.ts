// Google Analytics Utility Functions
const GA_ID = "G-E580K4QQ3Q";

// Extend Window interface to include gtag and dataLayer
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
export const initializeGA = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];

    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };

    gtag("js", new Date());
    gtag("config", GA_ID, {
      page_path: window.location.pathname,
    });

    window.gtag = gtag;
  }
};

// Track Page View
export const trackPageView = (path: string) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
};

// Generic event tracker
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

// Track Product View
export const trackProductView = (
  productId: string,
  productName: string,
  price?: number,
  category?: string
) => {
  trackEvent("view_item", {
    currency: "INR",
    value: price || 0,
    items: [
      {
        item_id: productId,
        item_name: productName,
        item_category: category || "products",
        price: price || 0,
      },
    ],
  });
};

// Track Add to Cart
export const trackAddToCart = (
  productId: string,
  productName: string,
  quantity: number = 1,
  price?: number
) => {
  trackEvent("add_to_cart", {
    currency: "INR",
    value: (price || 0) * quantity,
    items: [
      {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price || 0,
      },
    ],
  });
};

// Track Remove from Cart
export const trackRemoveFromCart = (
  productId: string,
  productName: string,
  quantity: number = 1,
  price?: number
) => {
  trackEvent("remove_from_cart", {
    currency: "INR",
    value: (price || 0) * quantity,
    items: [
      {
        item_id: productId,
        item_name: productName,
        quantity: quantity,
        price: price || 0,
      },
    ],
  });
};

// Track Purchase/Begin Checkout
export const trackPurchase = (
  orderId: string,
  totalValue: number,
  items: Array<{ id: string; name: string; quantity: number; price: number }>,
  userEmail?: string
) => {
  trackEvent("purchase", {
    transaction_id: orderId,
    currency: "INR",
    value: totalValue,
    user_email: userEmail || "",
    items: items.map((item) => ({
      item_id: item.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
  });
};

// Track Search
export const trackSearch = (searchQuery: string, resultsCount?: number) => {
  trackEvent("search", {
    search_term: searchQuery,
    results_count: resultsCount || 0,
  });
};

// Track Form Submission
export const trackFormSubmission = (formName: string, userEmail?: string) => {
  trackEvent("form_submission", {
    form_name: formName,
    user_email: userEmail || "",
  });
};

// Track Sign Up / Registration
export const trackSignUp = (signUpMethod: string, userEmail?: string) => {
  trackEvent("sign_up", {
    method: signUpMethod,
    user_email: userEmail || "",
  });
};

// Track Login
export const trackLogin = (loginMethod: string) => {
  trackEvent("login", {
    method: loginMethod,
  });
};

// Track Contact Form
export const trackContactFormSubmission = (userEmail?: string, phone?: string) => {
  trackEvent("contact_form_submission", {
    user_email: userEmail || "",
    phone: phone || "",
  });
};

// Track Feedback Submission
export const trackFeedbackSubmission = (feedbackType?: string, userEmail?: string) => {
  trackEvent("feedback_submission", {
    feedback_type: feedbackType || "",
    user_email: userEmail || "",
  });
};

// Track Community Join
export const trackCommunityJoin = (communityName: string, userEmail?: string) => {
  trackEvent("community_join", {
    community_name: communityName,
    user_email: userEmail || "",
  });
};

// Track Link Click
export const trackLinkClick = (linkName: string, linkUrl: string) => {
  trackEvent("link_click", {
    link_name: linkName,
    link_url: linkUrl,
  });
};

// Track Video Play
export const trackVideoPlay = (videoName: string, videoUrl?: string) => {
  trackEvent("video_play", {
    video_name: videoName,
    video_url: videoUrl || "",
  });
};

// Track Bulk Order Initiation
export const trackBulkOrderInitiation = (userEmail?: string) => {
  trackEvent("bulk_order_initiated", {
    user_email: userEmail || "",
  });
};

// Track Promo Code Usage
export const trackPromoCodeUsed = (promoCode: string, discountAmount?: number) => {
  trackEvent("promo_code_used", {
    promo_code: promoCode,
    discount_amount: discountAmount || 0,
  });
};

// Track Page Scroll (percentage of page viewed)
export const trackScrollDepth = (scrollPercentage: number) => {
  trackEvent("scroll_depth", {
    scroll_percentage: scrollPercentage,
  });
};

// Track Click on CTAs
export const trackCTAClick = (ctaName: string, ctaText?: string) => {
  trackEvent("cta_click", {
    cta_name: ctaName,
    cta_text: ctaText || "",
  });
};

// Debug function - Check if GA is loaded
export const isGALoaded = () => {
  if (typeof window !== "undefined") {
    const isLoaded = !!window.gtag;
    const hasDataLayer = Array.isArray(window.dataLayer);
    console.log("GA Debug Info:", {
      gtag_available: isLoaded,
      dataLayer_available: hasDataLayer,
      dataLayer_length: hasDataLayer ? window.dataLayer.length : 0,
    });
    return isLoaded && hasDataLayer;
  }
  return false;
};
