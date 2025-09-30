"use client";
import { useEffect } from "react";

export default function MetaCapiPageView() {
  useEffect(() => {
    // avoid double-send in dev StrictMode
    if (sessionStorage.getItem("capi_pv_sent")) return;
    sessionStorage.setItem("capi_pv_sent", "1");

    fetch("/api/meta-conversion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event_name: "PageView",
        event_time: Math.floor(Date.now() / 1000),
        event_id: "pageview_" + Date.now(),
        event_source_url: window.location.href,
        action_source: "website",
        user_data: {},
        custom_data: { url: window.location.href },
      }),
    }).catch(() => {});
  }, []);

  return null;
}
