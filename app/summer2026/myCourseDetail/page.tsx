// app/summercamp2026/myCourseDeatil/page.tsx
// This outer file ONLY provides the required Suspense boundary.
// All real logic lives in CourseDetailContent below.

import { Suspense } from "react";
import CourseDetailContent from "./CourseDetailContent";

export default function MyCourseDetailPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg,#0A8A80 0%,#0B3F44 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                border: "4px solid rgba(255,255,255,0.3)",
                borderTopColor: "#D8AE4F",
                margin: "0 auto 20px",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                color: "rgba(255,255,255,0.70)",
                fontSize: 15,
              }}
            >
              Loading your enrollment…
            </p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        </div>
      }
    >
      <CourseDetailContent />
    </Suspense>
  );
}
