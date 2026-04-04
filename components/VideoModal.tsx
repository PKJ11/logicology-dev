"use client";
import { useEffect } from "react";
import { generateVideoSchema } from "@/lib/seo-schema";

export default function VideoModal({
  open,
  onClose,
  youtubeUrl,
  title = "Video",
  description = "Educational video content",
  duration = "PT2M",
}: {
  open: boolean;
  onClose: () => void;
  youtubeUrl: string; // full URL or share link
  title?: string;
  description?: string;
  duration?: string;
}) {
  // lock scroll + close on ESC
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [open, onClose]);

  if (!open) return null;

  // Convert any YT URL to embeddable format
  const toEmbed = (url: string) => {
    try {
      const u = new URL(url);
      // youtu.be/<id>
      if (u.hostname.includes("youtu.be")) {
        return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}?autoplay=1&rel=0`;
      }
      // youtube.com/watch?v=<id>
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
      // fallback
      return url;
    } catch {
      return url;
    }
  };

  const embedSrc = toEmbed(youtubeUrl);

  // Generate video schema markup
  const videoSchema = generateVideoSchema({
    url: youtubeUrl,
    title,
    description,
    duration,
    embedUrl: embedSrc,
    contentUrl: youtubeUrl,
  });

  return (
    <>
      {/* Video schema markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(videoSchema),
        }}
      />

      <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close video modal"
            title="Close"
            className="rounded-full p-2 transition hover:bg-gray-100"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M6.225 4.811 4.811 6.225 9.586 11 4.81 15.775l1.414 1.414L11 12.414l4.775 4.775 1.414-1.414L12.414 11l4.775-4.775-1.414-1.414L11 9.586z" />
            </svg>
          </button>
        </div>
        {/* Player 16:9 */}
        <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
          <iframe
            className="absolute inset-0 h-full w-full"
            src={embedSrc}
            title={title}
            aria-label={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
}
