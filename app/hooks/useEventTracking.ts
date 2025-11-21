"use client";

import { trackEvent } from "@/lib/gtag";

export const useEventTracking = () => {
  return {
    trackEvent,
  };
};
