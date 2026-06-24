"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";
import Community from "@/components/Community";
import Image from "next/image";
import { SubscriptionProvider, useSubscription } from "../contexts/SubscriptionContext";
import { TiersProvider, useTiers } from "../contexts/TiersContext";
import { useToast } from "../contexts/ToastContext";
import { ContentItem, TierId } from "../types/subscription";
import Script from "next/script";
import SubscriptionModal from "@/components/SubscriptionModal";
import NavBar from "@/components/NavBar";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Worksheet {
  id: number;
  title: string;
  description: string;
  pdfPath: string;
  imagePath: string;
  category: string;
  difficulty: string;
}

// Jio Interakt API configuration
const INTERAKT_API_KEY = "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";
const INTERAKT_BASE_URL = "https://api.interakt.ai/v1/public";

// WhatsApp template names
const WHATSAPP_TEMPLATES = {
  COMMUNITY_INVITE: "community_invite",
  WELCOME: "community_welcome",
};

// Worksheets data with Worksheet001 to Worksheet005
const WORKSHEETS: Worksheet[] = [
  {
    id: 1,
    title: "Maze Games",
    description:
      "Navigate through challenging mazes and find the correct paths to develop problem-solving skills and spatial awareness.",
    pdfPath: "/pdfs/Community/Worksheet001.pdf",
    imagePath: "/Community/worksheet1-preview.jpg",
    category: "Puzzles",
    difficulty: "Easy",
  },
  {
    id: 2,
    title: "Country Word Search",
    description:
      "Discover countries from around the world in engaging word search puzzles that enhance vocabulary and geographical knowledge.",
    pdfPath: "/pdfs/Community/Worksheet002.pdf",
    imagePath: "/pdfs/Community/worksheet2-preview.jpg",
    category: "Word Games",
    difficulty: "Medium",
  },
  {
    id: 3,
    title: "Colouring Activity",
    description:
      "Express creativity with beautiful coloring pages featuring animals, nature scenes, and fun characters for artistic development.",
    pdfPath: "/pdfs/Community/Worksheet003.pdf",
    imagePath: "/pdfs/Community/worksheet3-preview.jpg",
    category: "Art",
    difficulty: "Easy",
  },
  {
    id: 4,
    title: "Find My Kite",
    description:
      "Help characters find their lost kites in visual search puzzles that improve observation skills and attention to detail.",
    pdfPath: "/pdfs/Community/Worksheet004.pdf",
    imagePath: "/Community/worksheet4-preview.jpg",
    category: "Puzzles",
    difficulty: "Medium",
  },
  {
    id: 5,
    title: "Crack The Zoo Codes",
    description:
      "Decipher secret codes and solve animal-themed puzzles to rescue zoo animals using logical thinking and pattern recognition.",
    pdfPath: "/pdfs/Community/Worksheet005.pdf",
    imagePath: "/Community/worksheet5-preview.jpg",
    category: "Logic",
    difficulty: "Hard",
  },
];

// Floating Shapes Component for playful background
function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-10 top-20 h-16 w-16 animate-float-slow rounded-full bg-yellow-300 opacity-20"></div>
      <div className="absolute right-20 top-40 h-24 w-24 animate-float rounded-full bg-pink-300 opacity-20"></div>
      <div className="absolute bottom-32 left-1/4 h-20 w-20 rotate-45 animate-float-slow rounded-lg bg-green-300 opacity-20"></div>
      <div className="absolute left-1/3 top-60 h-32 w-32 animate-float rounded-full bg-purple-300 opacity-10"></div>
      <div className="absolute bottom-20 right-1/4 h-28 w-28 animate-float-slow rounded-full bg-blue-300 opacity-20"></div>
      <div className="absolute right-40 top-80 h-16 w-16 rotate-12 animate-float rounded-lg bg-orange-300 opacity-20"></div>
    </div>
  );
}

// Content Category Component with playful design
function ContentCategory({
  title,
  items,
  requiredTier,
  currentTier,
  icon,
  color,
}: {
  title: string;
  items: ContentItem[];
  requiredTier: TierId;
  currentTier: TierId;
  icon: string;
  color: string;
}) {
  const { getTierById } = useTiers();
  const { initiateUpgrade } = useSubscription();
  const canAccess = currentTier >= requiredTier;
  const requiredTierData = getTierById(requiredTier);

  if (items.length === 0) return null;

  return (
    <div className="relative mb-16">
      {/* Section Header with Playful Design */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`h-14 w-14 rounded-2xl ${color} flex -rotate-3 transform items-center justify-center text-3xl shadow-lg transition-transform hover:rotate-0`}
          >
            {icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`rounded-full px-3 py-1 text-sm ${color} text-white`}>
                {items.length} activities
              </span>
            </div>
          </div>
        </div>

        {!canAccess && requiredTierData && (
          <div className="flex items-center gap-3 rounded-full bg-yellow-100 px-4 py-2">
            <span className="text-sm text-yellow-800">
              ✨ Unlock with {requiredTierData.name} plan
            </span>
            <button
              onClick={() => initiateUpgrade(requiredTier)}
              className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform hover:scale-105"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Content Grid - Playful Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item._id || item.id} item={item} canAccess={canAccess} color={color} />
        ))}
      </div>
    </div>
  );
}

// Content Card Component with beautiful design
// Content Card Component with beautiful design and video modal
function ContentCard({
  item,
  canAccess,
  color,
}: {
  item: ContentItem;
  canAccess: boolean;
  color: string;
}) {
  const { getTierById } = useTiers();
  const { initiateUpgrade } = useSubscription();
  const router = useRouter();
  const requiredTierData = getTierById(item.tierId);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Get embed URL from various sources
  const getEmbedUrl = () => {
    if (item.embedCode) {
      // If it's already an embed code, extract src
      const srcMatch = item.embedCode.match(/src="([^"]+)"/);
      if (srcMatch && srcMatch[1]) {
        return srcMatch[1];
      }
      return item.embedCode;
    }
    if (item.externalLink) {
      const videoId = getYouTubeId(item.externalLink);
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
      }
      return item.externalLink;
    }
    return null;
  };

  const handleWatchVideo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!canAccess) {
      initiateUpgrade(item.tierId);
      return;
    }
    setIsModalOpen(true);
  };

  const handleClick = () => {
    if (!canAccess) {
      initiateUpgrade(item.tierId);
      return;
    }

    // Handle content access based on type
    switch (item.type) {
      case "worksheet":
        if (item.files && item.files.length > 0) {
          window.open(item.files[0].url, "_blank");
        }
        break;
      case "wordwall":
        if (item.embedCode) {
          window.open(item.embedCode, "_blank");
        }
        break;
      case "mindstamp":
        // Don't auto-open, modal will handle
        break;
      case "assessment":
        if (item.files && item.files.length > 0) {
          window.open(item.files[0].url, "_blank");
        }
        break;
      case "external_link":
        if (item.externalLink) {
          window.open(item.externalLink, "_blank");
        }
        break;
    }
  };

  // Get appropriate icon and background for content type
  const getTypeIcon = () => {
    switch (item.type) {
      case "worksheet":
        return "📄";
      case "wordwall":
        return "🧩";
      case "mindstamp":
        return "🎥";
      case "assessment":
        return "📝";
      case "external_link":
        return "🔗";
      default:
        return "📁";
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case "worksheet":
        return "bg-green-100 text-green-700";
      case "wordwall":
        return "bg-blue-100 text-blue-700";
      case "mindstamp":
        return "bg-purple-100 text-purple-700";
      case "assessment":
        return "bg-orange-100 text-orange-700";
      case "external_link":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Get thumbnail URL
  const getThumbnail = () => {
    if (item.type === "mindstamp" && item.externalLink) {
      const videoId = getYouTubeId(item.externalLink);
      if (videoId) {
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }
    }
    return item.thumbnail || null;
  };

  const thumbnail = getThumbnail();
  const embedUrl = getEmbedUrl();

  return (
    <>
      <div
        onClick={handleClick}
        className={`group relative cursor-pointer overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
          !canAccess ? "opacity-75" : ""
        }`}
      >
        {/* Decorative top bar */}
        <div className={`h-2 w-full ${color}`}></div>

        {/* Content Image/Icon Area */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          {thumbnail ? (
            <img src={thumbnail} alt={item.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="transform text-7xl transition-transform group-hover:scale-110">
                {getTypeIcon()}
              </span>
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute left-3 top-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium shadow-md ${getTypeColor()}`}
            >
              {getTypeIcon()} {item.type}
            </span>
          </div>

          {/* Lock/Unlock Badge */}
          {!canAccess && (
            <div className="absolute right-3 top-3">
              <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-white shadow-md">
                🔒 Locked
              </span>
            </div>
          )}

          {/* Play button for videos */}
          {canAccess && item.type === "mindstamp" && (
            <div
              onClick={handleWatchVideo}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <div className="flex h-16 w-16 transform items-center justify-center rounded-full bg-red-600 shadow-xl transition-transform hover:bg-red-700 group-hover:scale-110">
                <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5">
          <h3 className="mb-2 line-clamp-1 text-xl font-bold text-gray-800">{item.title}</h3>
          <p className="mb-4 line-clamp-2 text-sm text-gray-600">{item.description}</p>

          {/* Tags */}
          <div className="mb-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
              📚 {item.category}
            </span>
            {item.wordwallHeader && (
              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
                🧩 {item.wordwallHeader}
              </span>
            )}
            {item.fileCount && item.fileCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                📎 {item.fileCount} {item.fileCount === 1 ? "file" : "files"}
              </span>
            )}
          </div>

          {/* Action Button */}
          {canAccess ? (
            item.type === "mindstamp" ? (
              <button
                onClick={handleWatchVideo}
                className={`w-full ${color} flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-center font-medium text-white transition-all hover:scale-105 hover:shadow-lg`}
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Video
              </button>
            ) : (
              <div
                className={`${color} rounded-xl px-4 py-2 text-center font-medium text-white transition-shadow hover:shadow-lg`}
              >
                {item.type === "wordwall"
                  ? "🎮 Play Game"
                  : item.type === "worksheet"
                    ? "📥 Download"
                    : item.type === "assessment"
                      ? "📝 Start Assessment"
                      : "🔗 Open Link"}
              </div>
            )
          ) : (
            <div className="rounded-xl bg-gray-200 px-4 py-2 text-center font-medium text-gray-500">
              Requires {requiredTierData?.name || `Tier ${item.tierId}`}
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-gradient-to-br from-transparent to-gray-100 opacity-50"></div>
      </div>

      {/* Enhanced Video Modal */}
      {isModalOpen && embedUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/80">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="group flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  <svg
                    className="h-6 w-6 text-white transition-transform group-hover:scale-110"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative bg-black pt-[56.25%]">
              {embedUrl.includes("youtube.com/embed") ? (
                <iframe
                  className="absolute left-0 top-0 h-full w-full"
                  src={embedUrl}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="absolute left-0 top-0 h-full w-full"
                  controls
                  autoPlay
                  src={embedUrl}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            {/* Video Info Footer */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
                      <span className="text-sm text-green-400">✓</span>
                    </div>
                    <span className="text-sm text-gray-300">Ready to watch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-300">HD Quality</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (item.externalLink) {
                      window.open(item.externalLink, "_blank");
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  Open in New Tab
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Worksheet Card Component with playful design
// Worksheet Card Component with Premium Design
function WorksheetCard({
  worksheet,
  onDownload,
  onPreview,
  isPremium = false,
}: {
  worksheet: Worksheet;
  onDownload: (pdfPath: string, title: string) => void;
  onPreview: (pdfPath: string) => void;
  isPremium?: boolean;
}) {
  const difficultyColors = {
    Easy: "bg-green-100 text-green-700 border-green-200",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    Hard: "bg-red-100 text-red-700 border-red-200",
  };

  const difficultyIcons = {
    Easy: "🌟",
    Medium: "⭐",
    Hard: "⚡",
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -right-12 top-6 z-10 rotate-45 bg-gradient-to-r from-yellow-400 to-yellow-500 px-12 py-1 text-xs font-bold text-white shadow-lg">
          PREMIUM
        </div>
      )}

      {/* Decorative top gradient */}
      <div
        className={`h-2 w-full bg-gradient-to-r ${
          worksheet.difficulty === "Easy"
            ? "from-green-400 to-green-500"
            : worksheet.difficulty === "Medium"
              ? "from-yellow-400 to-yellow-500"
              : "from-red-400 to-red-500"
        }`}
      ></div>

      {/* Image/Icon Area with Playful Background */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-0 top-0 h-32 w-32 -translate-x-16 -translate-y-16 rounded-full bg-yellow-300"></div>
          <div className="absolute bottom-0 right-0 h-40 w-40 translate-x-20 translate-y-20 rounded-full bg-pink-300"></div>
        </div>

        {/* Main Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="transform text-7xl transition-all duration-300 group-hover:rotate-3 group-hover:scale-110">
              {worksheet.id === 1 && "🌀"}
              {worksheet.id === 2 && "🔍"}
              {worksheet.id === 3 && "🎨"}
              {worksheet.id === 4 && "🪁"}
              {worksheet.id === 5 && "🔐"}
            </span>

            {/* Floating elements */}
            <div className="absolute -right-4 -top-4 h-8 w-8 animate-pulse rounded-full bg-yellow-300 opacity-60"></div>
            <div className="absolute -bottom-2 -left-2 h-6 w-6 animate-bounce rounded-full bg-pink-300 opacity-60"></div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`rounded-full border px-3 py-1.5 text-xs font-medium shadow-md ${difficultyColors[worksheet.difficulty as keyof typeof difficultyColors] || "bg-gray-100 text-gray-700"}`}
          >
            {difficultyIcons[worksheet.difficulty as keyof typeof difficultyIcons]}{" "}
            {worksheet.difficulty}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur-sm">
            {worksheet.category || "Activity"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="mb-2 line-clamp-1 text-xl font-bold text-gray-800 transition-colors group-hover:text-orange-600">
          {worksheet.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-sm text-gray-600">{worksheet.description}</p>

        {/* Features/Tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-purple-100 px-2 py-1 text-xs text-purple-600">
            🧩 Problem Solving
          </span>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
            📚 Learning Fun
          </span>
          <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-600">
            ⏱️ 15-20 mins
          </span>
        </div>

        {/* Action Buttons - Redesigned with Preview */}
        <div className="flex gap-3">
          <button
            onClick={() => onPreview(worksheet.pdfPath)}
            className="group/preview flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gray-600 to-gray-700 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="h-4 w-4 transition-transform group-hover/preview:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span>Quick Preview</span>
          </button>

          <button
            onClick={() => onDownload(worksheet.pdfPath, worksheet.title)}
            className="group/download flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 py-3 text-sm font-medium text-white transition-all hover:scale-105 hover:shadow-lg"
          >
            <svg
              className="h-4 w-4 group-hover/download:animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Download</span>
          </button>
        </div>

        {/* Premium Feature Indicator */}
        {isPremium && (
          <div className="mt-3 rounded-lg bg-yellow-50 py-2 text-center text-xs text-yellow-600">
            ⭐ Premium Activity - Exclusive Content
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-8 -right-8 h-16 w-16 rounded-full bg-gradient-to-br from-transparent to-gray-100 opacity-50"></div>
    </div>
  );
}

// Guideline Item Component with playful icons
function GuidelineItem({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="group rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-pink-100 text-3xl transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h4 className="mb-2 text-xl font-bold text-gray-800">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Main Community Page Content Component
function CommunityPageContent() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [contentLoading, setContentLoading] = useState(true);
  const { currentTier, showSubscriptionModal, setShowSubscriptionModal, canAccessTier } =
    useSubscription();
  const { tiers, loading: tiersLoading, getTierById } = useTiers();
  const { showToast } = useToast();
  const router = useRouter();

  const [showWhatsappForm, setShowWhatsappForm] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendNumber, setFriendNumber] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;
      const token = localStorage.getItem("communityToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      try {
        setUserData(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setContentLoading(true);
    try {
      const response = await fetch("/api/admin/content");
      const data = await response.json();

      if (data.success) {
        setContentItems(data.content);
      }
    } catch (error) {
      console.error("Error fetching content:", error);
      showToast("Failed to load content", "error");
    } finally {
      setContentLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("communityToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("otpSent");
    setUserData(null);
    showToast("👋 Logged out successfully!", "info");
  };

  const copyCommunityLink = () => {
    const link = "https://www.logicology.in/Community";
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    showToast("📋 Link copied to clipboard!", "success");
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const cleanPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, "");
  };

  const extractCountryCode = (
    phoneNumber: string
  ): { countryCode: string; cleanedNumber: string } => {
    const cleaned = cleanPhoneNumber(phoneNumber);
    if (cleaned.startsWith("91") && cleaned.length >= 12) {
      return {
        countryCode: "+91",
        cleanedNumber: cleaned.substring(2),
      };
    }
    return {
      countryCode: "+91",
      cleanedNumber: cleaned.length > 10 ? cleaned.slice(-10) : cleaned,
    };
  };

  const sendInteraktMessage = async (
    phoneNumber: string,
    templateName: string,
    bodyValues: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
      const { countryCode, cleanedNumber } = extractCountryCode(phoneNumber);

      if (cleanedNumber.length !== 10) {
        throw new Error("Invalid phone number. Please enter a 10-digit Indian mobile number.");
      }

      const trackUserResponse = await fetch(`${INTERAKT_BASE_URL}/track/users/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedNumber,
          countryCode: countryCode,
          traits: {
            name: friendName,
            source: "community_invite",
            invitedBy: userData?.name || "PlayThinkers Community",
            invitedByEmail: userData?.email || "",
            inviteDate: new Date().toISOString(),
          },
        }),
      });

      await trackUserResponse.json();

      const messageResponse = await fetch(`${INTERAKT_BASE_URL}/message/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: countryCode,
          phoneNumber: cleanedNumber,
          type: "Template",
          template: {
            name: templateName,
            languageCode: "en",
            bodyValues: bodyValues,
          },
        }),
      });

      const messageResult = await messageResponse.json();

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message`);
      }

      return {
        success: true,
        messageId: messageResult.id,
      };
    } catch (error: any) {
      console.error("Error sending Interakt message:", error);
      return {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
      };
    }
  };

  const handleWhatsappInvite = async () => {
    if (!friendName.trim() || !friendNumber.trim()) {
      setInviteStatus({
        success: false,
        message: "Please enter both name and phone number",
      });
      setTimeout(() => setInviteStatus(null), 3000);
      return;
    }

    setSendingInvite(true);
    setInviteStatus(null);

    try {
      const bodyValues = [
        friendName,
        userData?.name || "A friend",
        "PlayThinkers Community",
        "https://www.logicology.in/Community",
      ];

      const result = await sendInteraktMessage(
        friendNumber,
        WHATSAPP_TEMPLATES.COMMUNITY_INVITE,
        bodyValues
      );

      if (result.success) {
        setInviteStatus({
          success: true,
          message: `✨ Invitation sent to ${friendName}!`,
        });
        showToast(`✨ Invitation sent to ${friendName}!`, "success");

        setShowWhatsappForm(false);
        setFriendName("");
        setFriendNumber("");

        setTimeout(() => setInviteStatus(null), 5000);
      } else {
        setInviteStatus({
          success: false,
          message: result.error || "Failed to send invitation. Please try again.",
        });
        showToast(result.error || "Failed to send invitation", "error");
      }
    } catch (error: any) {
      setInviteStatus({
        success: false,
        message: error.message || "An error occurred. Please try again.",
      });
      showToast(error.message || "An error occurred", "error");
    } finally {
      setSendingInvite(false);
    }
  };

  const downloadPDF = (pdfPath: string, title: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    const filename = pdfPath.split("/").pop() || `${title.replace(/\s+/g, "_")}.pdf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`📥 Downloading ${title}...`, "info");
  };

  const openPreview = (pdfPath: string) => {
    setPreviewPdf(pdfPath);
  };

  const closePreview = () => {
    setPreviewPdf(null);
  };

  // Group content by category based on current tier access
  const worksheets = contentItems.filter(
    (item) => item.type === "worksheet" && canAccessTier(item.tierId)
  );
  const wordwallGames = contentItems.filter(
    (item) => item.type === "wordwall" && canAccessTier(item.tierId)
  );
  const videos = contentItems.filter(
    (item) => item.type === "mindstamp" && canAccessTier(item.tierId)
  );
  const assessments = contentItems.filter(
    (item) => item.type === "assessment" && canAccessTier(item.tierId)
  );

  const currentTierData = getTierById(currentTier);
  const nextTierData = getTierById((currentTier + 1) as TierId);

  if (isLoading || tiersLoading || contentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <FloatingShapes />
        <div className="relative z-10 text-center">
          <div className="relative mx-auto mb-6 h-24 w-24">
            <div className="absolute inset-0 animate-ping rounded-full bg-gradient-to-r from-orange-500 to-pink-500 opacity-25"></div>
            <div className="absolute inset-2 animate-spin rounded-full bg-gradient-to-r from-orange-500 to-pink-500"></div>
            <div className="absolute inset-4 flex items-center justify-center rounded-full bg-white">
              <span className="text-3xl">🎮</span>
            </div>
          </div>
          <p className="animate-bounce text-2xl font-bold text-gray-800">
            Loading Fun Activities...
          </p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show the Community component
  if (!userData) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <NavBar />
        <Community />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="transform rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-8 text-white shadow-2xl transition-transform hover:scale-105">
            <h2 className="mb-4 text-4xl font-bold">🎮 Join the Fun!</h2>
            <p className="mb-6 text-xl opacity-90">
              Get access to premium worksheets, interactive games, and exciting videos!
            </p>
            <button
              onClick={() => router.push("/login")}
              className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-orange-600 transition-all hover:scale-105 hover:shadow-xl"
            >
              Login to Start Playing →
            </button>
          </div>
        </div>

        <SiteFooter />
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50">
        <FloatingShapes />

        {/* Header */}
        <header className="relative z-10 border-b border-white/20 bg-white/80 shadow-lg backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 py-4 sm:flex-row">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Link href="/" className="flex items-center">
                  <div className="relative h-12 w-48">
                    <Image
                      src="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png"
                      alt="Mathology Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                </Link>
              </div>

              <div className="flex items-center gap-4">
                {/* Plan Badge */}
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-4 py-2 text-white shadow-md">
                  <span className="font-medium">✨ {currentTierData?.name || "Free"} Plan</span>
                </div>

                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="rounded-full bg-white px-4 py-2 font-medium text-orange-600 shadow-md transition-all hover:scale-105 hover:shadow-xl"
                >
                  {currentTier === 1 ? "🚀 Upgrade" : "⚙️ Manage"}
                </button>

                <div className="flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 backdrop-blur-sm">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-orange-500 to-pink-500 font-bold text-white">
                    {userData?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-medium text-gray-800">{userData?.name}</p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                    title="Logout"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Welcome Banner */}
          <section className="mb-16">
            <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-8 text-white shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="text-6xl">🎉</div>
                <div>
                  <h1 className="mb-2 text-4xl font-bold">
                    Welcome back, {userData?.name?.split(" ")[0]}!
                  </h1>
                  <p className="text-xl opacity-90">
                    You're on the{" "}
                    <span className="font-bold">{currentTierData?.name || "Free"}</span> plan.
                    {currentTier === 1
                      ? " Upgrade to unlock more fun!"
                      : " Enjoy your premium content!"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <section className="mb-8">
            {/* Worksheets Section */}
            {worksheets.length > 0 && (
              <ContentCategory
                title="📚 Worksheets & Activities"
                items={worksheets}
                requiredTier={1}
                currentTier={currentTier}
                icon="📄"
                color="bg-gradient-to-r from-green-500 to-green-600"
              />
            )}

            {/* Wordwall Games Section */}
            {currentTier >= 2 && wordwallGames.length > 0 && (
              <ContentCategory
                title="🧩 Interactive Games"
                items={wordwallGames}
                requiredTier={2}
                currentTier={currentTier}
                icon="🎮"
                color="bg-gradient-to-r from-blue-500 to-blue-600"
              />
            )}

            {/* Videos Section */}
            {currentTier >= 3 && videos.length > 0 && (
              <ContentCategory
                title="🎥 Video Lessons"
                items={videos}
                requiredTier={3}
                currentTier={currentTier}
                icon="🎬"
                color="bg-gradient-to-r from-purple-500 to-purple-600"
              />
            )}

            {/* Assessments Section */}
            {currentTier >= 4 && assessments.length > 0 && (
              <ContentCategory
                title="📝 Challenges & Assessments"
                items={assessments}
                requiredTier={4}
                currentTier={currentTier}
                icon="🏆"
                color="bg-gradient-to-r from-orange-500 to-orange-600"
              />
            )}
          </section>

          {/* Premium Worksheets Showcase */}
          <section className="mb-16">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-pink-500 text-3xl shadow-lg">
                  ⭐
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Premium Worksheets</h2>
                  <p className="text-gray-600">Exclusive content for our amazing members</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {WORKSHEETS.map((worksheet) => (
                  <WorksheetCard
                    key={worksheet.id}
                    worksheet={worksheet}
                    onDownload={downloadPDF}
                    onPreview={openPreview}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Community Guidelines */}
          <section className="mb-16">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
                🌈 Community Guidelines
              </h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <GuidelineItem
                  title="Be Creative"
                  description="Share unique ideas and creative solutions to puzzles."
                  icon="🎨"
                />
                <GuidelineItem
                  title="Share Learning"
                  description="Help fellow PlayThinkers learn and grow together."
                  icon="🤝"
                />
                <GuidelineItem
                  title="Play Fair"
                  description="Respect all community members in discussions and activities."
                  icon="⚖️"
                />
                <GuidelineItem
                  title="Keep it Fun"
                  description="Maintain a positive and engaging learning environment."
                  icon="😊"
                />
              </div>
            </div>
          </section>

          {/* Upgrade CTA */}
          {currentTier < 4 && nextTierData && (
            <section className="mb-16">
              <div className="rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-8 text-center text-white shadow-2xl">
                <h3 className="mb-4 text-3xl font-bold">🚀 Unlock More Fun!</h3>
                <p className="mb-6 text-xl opacity-90">
                  Upgrade to {nextTierData.name} plan and get access to exclusive content!
                </p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="rounded-full bg-white px-8 py-3 text-lg font-semibold text-purple-600 transition-all hover:scale-105 hover:shadow-xl"
                >
                  Upgrade Now →
                </button>
              </div>
            </section>
          )}

          {/* Share & Invite Section */}
          <section className="mb-16">
            <div className="rounded-3xl bg-white p-8 shadow-xl">
              <div className="mb-8 text-center">
                <h3 className="mb-2 text-3xl font-bold text-gray-800">❤️ Love Learning?</h3>
                <p className="text-xl text-gray-600">Share the fun with friends!</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={copyCommunityLink}
                  className="flex items-center gap-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Share Community Link
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px w-16 bg-gray-300"></div>
                  <span className="font-medium text-gray-500">OR</span>
                  <div className="h-px w-16 bg-gray-300"></div>
                </div>

                {!showWhatsappForm ? (
                  <button
                    onClick={() => setShowWhatsappForm(true)}
                    className="flex items-center gap-3 rounded-full bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    Invite via WhatsApp
                  </button>
                ) : (
                  <div className="w-full max-w-md rounded-2xl bg-gray-50 p-6">
                    <h4 className="mb-4 text-xl font-bold text-gray-800">📱 Invite Friend</h4>

                    {inviteStatus && (
                      <div
                        className={`mb-4 rounded-lg p-3 ${
                          inviteStatus.success
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {inviteStatus.message}
                      </div>
                    )}

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Friend's Name"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        disabled={sendingInvite}
                      />
                      <input
                        type="tel"
                        placeholder="Friend's Phone Number"
                        value={friendNumber}
                        onChange={(e) => setFriendNumber(e.target.value)}
                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                        disabled={sendingInvite}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleWhatsappInvite}
                          disabled={sendingInvite}
                          className="flex-1 rounded-xl bg-green-500 py-3 font-medium text-white transition-colors hover:bg-green-600 disabled:opacity-50"
                        >
                          {sendingInvite ? "Sending..." : "Send Invite"}
                        </button>
                        <button
                          onClick={() => {
                            setShowWhatsappForm(false);
                            setInviteStatus(null);
                          }}
                          className="flex-1 rounded-xl bg-gray-200 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-300"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Coming Soon */}
          <section className="text-center">
            <div className="rounded-3xl bg-gradient-to-r from-purple-100 to-pink-100 p-12">
              <span className="mb-4 block text-6xl">🚀</span>
              <h3 className="mb-2 text-3xl font-bold text-gray-800">
                More Exciting Content Coming Soon!
              </h3>
              <p className="text-xl text-gray-600">
                Stay tuned for weekly puzzles, monthly challenges, and interactive learning games.
              </p>
            </div>
          </section>
        </main>

        {/* PDF Preview Modal */}
        {previewPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl bg-white">
              <div className="h-[80vh]">
                <iframe src={previewPdf} className="h-full w-full" title="PDF Preview" />
              </div>
              <button
                onClick={closePreview}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        <SubscriptionModal
          isOpen={showSubscriptionModal}
          onClose={() => setShowSubscriptionModal(false)}
        />

        <SiteFooter />
      </div>
    </>
  );
}

// Add animations to global CSS
const styles = `
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-slow {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(-5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-slow {
  animation: float-slow 8s ease-in-out infinite;
}
`;

// Wrap with both providers
export default function CommunityPage() {
  return (
    <>
      <style jsx>{styles}</style>
      <TiersProvider>
        <SubscriptionProvider>
          <CommunityPageContent />
        </SubscriptionProvider>
      </TiersProvider>
    </>
  );
}
