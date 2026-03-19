'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SiteFooter from '@/components/Footer';
import Community from '@/components/Community';
import Image from 'next/image';
import { SubscriptionProvider, useSubscription } from '../contexts/SubscriptionContext';
import { TiersProvider, useTiers } from '../contexts/TiersContext';
import { useToast } from '../contexts/ToastContext';
import { ContentItem, TierId } from '../types/subscription';
import Script from 'next/script';
import SubscriptionModal from '@/components/SubscriptionModal';
import NavBar from '@/components/NavBar';

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
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-300 rounded-full opacity-20 animate-float-slow"></div>
      <div className="absolute top-40 right-20 w-24 h-24 bg-pink-300 rounded-full opacity-20 animate-float"></div>
      <div className="absolute bottom-32 left-1/4 w-20 h-20 bg-green-300 rounded-lg opacity-20 animate-float-slow rotate-45"></div>
      <div className="absolute top-60 left-1/3 w-32 h-32 bg-purple-300 rounded-full opacity-10 animate-float"></div>
      <div className="absolute bottom-20 right-1/4 w-28 h-28 bg-blue-300 rounded-full opacity-20 animate-float-slow"></div>
      <div className="absolute top-80 right-40 w-16 h-16 bg-orange-300 rounded-lg opacity-20 animate-float rotate-12"></div>
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
  color
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
    <div className="mb-16 relative">
      {/* Section Header with Playful Design */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform`}>
            {icon}
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-sm px-3 py-1 rounded-full ${color} text-white`}>
                {items.length} activities
              </span>
            </div>
          </div>
        </div>
        
        {!canAccess && requiredTierData && (
          <div className="flex items-center gap-3 bg-yellow-100 px-4 py-2 rounded-full">
            <span className="text-sm text-yellow-800">✨ Unlock with {requiredTierData.name} plan</span>
            <button
              onClick={() => initiateUpgrade(requiredTier)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform shadow-md"
            >
              Upgrade Now
            </button>
          </div>
        )}
      </div>

      {/* Content Grid - Playful Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ContentCard key={item._id || item.id} item={item} canAccess={canAccess} color={color} />
        ))}
      </div>
    </div>
  );
}

// Content Card Component with beautiful design
// Content Card Component with beautiful design and video modal
function ContentCard({ item, canAccess, color }: { item: ContentItem; canAccess: boolean; color: string }) {
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
    return (match && match[2].length === 11) ? match[2] : null;
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
      case 'worksheet':
        if (item.files && item.files.length > 0) {
          window.open(item.files[0].url, '_blank');
        }
        break;
      case 'wordwall':
        if (item.embedCode) {
          window.open(item.embedCode, '_blank');
        }
        break;
      case 'mindstamp':
        // Don't auto-open, modal will handle
        break;
      case 'assessment':
        if (item.files && item.files.length > 0) {
          window.open(item.files[0].url, '_blank');
        }
        break;
      case 'external_link':
        if (item.externalLink) {
          window.open(item.externalLink, '_blank');
        }
        break;
    }
  };

  // Get appropriate icon and background for content type
  const getTypeIcon = () => {
    switch (item.type) {
      case 'worksheet': return '📄';
      case 'wordwall': return '🧩';
      case 'mindstamp': return '🎥';
      case 'assessment': return '📝';
      case 'external_link': return '🔗';
      default: return '📁';
    }
  };

  const getTypeColor = () => {
    switch (item.type) {
      case 'worksheet': return 'bg-green-100 text-green-700';
      case 'wordwall': return 'bg-blue-100 text-blue-700';
      case 'mindstamp': return 'bg-purple-100 text-purple-700';
      case 'assessment': return 'bg-orange-100 text-orange-700';
      case 'external_link': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get thumbnail URL
  const getThumbnail = () => {
    if (item.type === 'mindstamp' && item.externalLink) {
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
        className={`group relative bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
          !canAccess ? 'opacity-75' : ''
        }`}
      >
        {/* Decorative top bar */}
        <div className={`h-2 w-full ${color}`}></div>
        
        {/* Content Image/Icon Area */}
        <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl transform group-hover:scale-110 transition-transform">
                {getTypeIcon()}
              </span>
            </div>
          )}
          
          {/* Type Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium shadow-md ${getTypeColor()}`}>
              {getTypeIcon()} {item.type}
            </span>
          </div>

          {/* Lock/Unlock Badge */}
          {!canAccess && (
            <div className="absolute top-3 right-3">
              <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                🔒 Locked
              </span>
            </div>
          )}

          {/* Play button for videos */}
          {canAccess && item.type === 'mindstamp' && (
            <div 
              onClick={handleWatchVideo}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform hover:bg-red-700">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">{item.title}</h3>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              📚 {item.category}
            </span>
            {item.wordwallHeader && (
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                🧩 {item.wordwallHeader}
              </span>
            )}
            {item.fileCount && item.fileCount > 0 && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                📎 {item.fileCount} {item.fileCount === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>

          {/* Action Button */}
          {canAccess ? (
            item.type === 'mindstamp' ? (
              <button
                onClick={handleWatchVideo}
                className={`w-full ${color} text-white rounded-xl py-2 px-4 text-center font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Watch Video
              </button>
            ) : (
              <div className={`${color} text-white rounded-xl py-2 px-4 text-center font-medium hover:shadow-lg transition-shadow`}>
                {item.type === 'wordwall' ? '🎮 Play Game' :
                 item.type === 'worksheet' ? '📥 Download' :
                 item.type === 'assessment' ? '📝 Start Assessment' :
                 '🔗 Open Link'}
              </div>
            )
          ) : (
            <div className="bg-gray-200 text-gray-500 rounded-xl py-2 px-4 text-center font-medium">
              Requires {requiredTierData?.name || `Tier ${item.tierId}`}
            </div>
          )}
        </div>

        {/* Decorative corner */}
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-transparent to-gray-100 rounded-full opacity-50"></div>
      </div>

      {/* Enhanced Video Modal */}
      {isModalOpen && embedUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-5xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                    <p className="text-white/80 text-sm mt-1">{item.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors backdrop-blur-sm group"
                >
                  <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative pt-[56.25%] bg-black">
              {embedUrl.includes('youtube.com/embed') ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={embedUrl}
                  title={item.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <video
                  className="absolute top-0 left-0 w-full h-full"
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
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-green-400 text-sm">✓</span>
                    </div>
                    <span className="text-gray-300 text-sm">Ready to watch</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-300 text-sm">HD Quality</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (item.externalLink) {
                      window.open(item.externalLink, '_blank');
                    }
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
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
    Easy: 'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Hard: 'bg-red-100 text-red-700 border-red-200',
  };

  const difficultyIcons = {
    Easy: '🌟',
    Medium: '⭐',
    Hard: '⚡',
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-yellow-400 to-yellow-500 px-12 py-1 text-xs font-bold text-white shadow-lg z-10">
          PREMIUM
        </div>
      )}

      {/* Decorative top gradient */}
      <div className={`h-2 w-full bg-gradient-to-r ${
        worksheet.difficulty === 'Easy' ? 'from-green-400 to-green-500' :
        worksheet.difficulty === 'Medium' ? 'from-yellow-400 to-yellow-500' :
        'from-red-400 to-red-500'
      }`}></div>
      
      {/* Image/Icon Area with Playful Background */}
      <div className="relative h-48 bg-gradient-to-br from-orange-100 via-pink-100 to-purple-100 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-300 rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-pink-300 rounded-full translate-x-20 translate-y-20"></div>
        </div>

        {/* Main Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <span className="text-7xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              {worksheet.id === 1 && '🌀'}
              {worksheet.id === 2 && '🔍'}
              {worksheet.id === 3 && '🎨'}
              {worksheet.id === 4 && '🪁'}
              {worksheet.id === 5 && '🔐'}
            </span>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-300 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-pink-300 rounded-full opacity-60 animate-bounce"></div>
          </div>
        </div>

        {/* Difficulty Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium shadow-md border ${difficultyColors[worksheet.difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-700'}`}>
            {difficultyIcons[worksheet.difficulty as keyof typeof difficultyIcons]} {worksheet.difficulty}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium shadow-md">
            {worksheet.category || 'Activity'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
          {worksheet.title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {worksheet.description}
        </p>

        {/* Features/Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
            🧩 Problem Solving
          </span>
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
            📚 Learning Fun
          </span>
          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
            ⏱️ 15-20 mins
          </span>
        </div>

        {/* Action Buttons - Redesigned with Preview */}
        <div className="flex gap-3">
          <button
            onClick={() => onPreview(worksheet.pdfPath)}
            className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl py-3 text-sm font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group/preview"
          >
            <svg className="w-4 h-4 group-hover/preview:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>Quick Preview</span>
          </button>
          
          <button
            onClick={() => onDownload(worksheet.pdfPath, worksheet.title)}
            className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl py-3 text-sm font-medium hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 group/download"
          >
            <svg className="w-4 h-4 group-hover/download:animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Download</span>
          </button>
        </div>

        {/* Premium Feature Indicator */}
        {isPremium && (
          <div className="mt-3 text-xs text-center text-yellow-600 bg-yellow-50 py-2 rounded-lg">
            ⭐ Premium Activity - Exclusive Content
          </div>
        )}
      </div>

      {/* Decorative corner */}
      <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-gradient-to-br from-transparent to-gray-100 rounded-full opacity-50"></div>
    </div>
  );
}

// Guideline Item Component with playful icons
function GuidelineItem({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group">
      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-pink-100 rounded-2xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h4 className="text-xl font-bold text-gray-800 mb-2">{title}</h4>
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
  const { currentTier, showSubscriptionModal, setShowSubscriptionModal, canAccessTier } = useSubscription();
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
      const response = await fetch('/api/admin/content');
      const data = await response.json();
      
      if (data.success) {
        setContentItems(data.content);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      showToast('Failed to load content', 'error');
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
    showToast('👋 Logged out successfully!', 'info');
  };

  const copyCommunityLink = () => {
    const link = "https://www.logicology.in/Community";
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    showToast('📋 Link copied to clipboard!', 'success');
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
        showToast(`✨ Invitation sent to ${friendName}!`, 'success');

        setShowWhatsappForm(false);
        setFriendName("");
        setFriendNumber("");

        setTimeout(() => setInviteStatus(null), 5000);
      } else {
        setInviteStatus({
          success: false,
          message: result.error || "Failed to send invitation. Please try again.",
        });
        showToast(result.error || 'Failed to send invitation', 'error');
      }
    } catch (error: any) {
      setInviteStatus({
        success: false,
        message: error.message || "An error occurred. Please try again.",
      });
      showToast(error.message || 'An error occurred', 'error');
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
    showToast(`📥 Downloading ${title}...`, 'info');
  };

  const openPreview = (pdfPath: string) => {
    setPreviewPdf(pdfPath);
  };

  const closePreview = () => {
    setPreviewPdf(null);
  };

  // Group content by category based on current tier access
  const worksheets = contentItems.filter(item => 
    item.type === 'worksheet' && canAccessTier(item.tierId)
  );
  const wordwallGames = contentItems.filter(item => 
    (item.type === 'wordwall') && canAccessTier(item.tierId)
  );
  const videos = contentItems.filter(item => 
    item.type === 'mindstamp' && canAccessTier(item.tierId)
  );
  const assessments = contentItems.filter(item => 
    item.type === 'assessment' && canAccessTier(item.tierId)
  );

  const currentTierData = getTierById(currentTier);
  const nextTierData = getTierById((currentTier + 1) as TierId);

  if (isLoading || tiersLoading || contentLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
        <FloatingShapes />
        <div className="text-center relative z-10">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-ping opacity-25"></div>
            <div className="absolute inset-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full animate-spin"></div>
            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center">
              <span className="text-3xl">🎮</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 animate-bounce">Loading Fun Activities...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show the Community component
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
        <NavBar/>
        <Community />

        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 p-8 text-white shadow-2xl transform hover:scale-105 transition-transform">
            <h2 className="mb-4 text-4xl font-bold">🎮 Join the Fun!</h2>
            <p className="mb-6 text-xl opacity-90">
              Get access to premium worksheets, interactive games, and exciting videos!
            </p>
            <button
              onClick={() => router.push('/login')}
              className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
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
      
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 relative overflow-hidden">
        <FloatingShapes />
        
        {/* Header */}
        <header className="relative z-10 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-lg">
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
                <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-md">
                  <span className="font-medium">✨ {currentTierData?.name || 'Free'} Plan</span>
                </div>
                
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-white text-orange-600 px-4 py-2 rounded-full font-medium shadow-md hover:shadow-xl transition-all hover:scale-105"
                >
                  {currentTier === 1 ? '🚀 Upgrade' : '⚙️ Manage'}
                </button>

                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {userData?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-800">{userData?.name}</p>
                    <p className="text-xs text-gray-500">{userData?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-500 hover:text-gray-700"
                    title="Logout"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
            <div className="bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-center gap-6">
                <div className="text-6xl">🎉</div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">Welcome back, {userData?.name?.split(' ')[0]}!</h1>
                  <p className="text-xl opacity-90">
                    You're on the <span className="font-bold">{currentTierData?.name || 'Free'}</span> plan. 
                    {currentTier === 1 ? ' Upgrade to unlock more fun!' : ' Enjoy your premium content!'}
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
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  ⭐
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Premium Worksheets</h2>
                  <p className="text-gray-600">Exclusive content for our amazing members</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">🌈 Community Guidelines</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-3xl p-8 text-white shadow-2xl text-center">
                <h3 className="text-3xl font-bold mb-4">🚀 Unlock More Fun!</h3>
                <p className="text-xl mb-6 opacity-90">
                  Upgrade to {nextTierData.name} plan and get access to exclusive content!
                </p>
                <button
                  onClick={() => setShowSubscriptionModal(true)}
                  className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold text-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Upgrade Now →
                </button>
              </div>
            </section>
          )}

          {/* Share & Invite Section */}
          <section className="mb-16">
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2">❤️ Love Learning?</h3>
                <p className="text-xl text-gray-600">Share the fun with friends!</p>
              </div>

              <div className="flex flex-col items-center gap-6">
                <button
                  onClick={copyCommunityLink}
                  className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Share Community Link
                </button>

                <div className="flex items-center gap-4">
                  <div className="h-px w-16 bg-gray-300"></div>
                  <span className="text-gray-500 font-medium">OR</span>
                  <div className="h-px w-16 bg-gray-300"></div>
                </div>

                {!showWhatsappForm ? (
                  <button
                    onClick={() => setShowWhatsappForm(true)}
                    className="bg-green-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    </svg>
                    Invite via WhatsApp
                  </button>
                ) : (
                  <div className="w-full max-w-md bg-gray-50 rounded-2xl p-6">
                    <h4 className="text-xl font-bold text-gray-800 mb-4">📱 Invite Friend</h4>
                    
                    {inviteStatus && (
                      <div className={`mb-4 p-3 rounded-lg ${
                        inviteStatus.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {inviteStatus.message}
                      </div>
                    )}

                    <div className="space-y-4">
                      <input
                        type="text"
                        placeholder="Friend's Name"
                        value={friendName}
                        onChange={(e) => setFriendName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        disabled={sendingInvite}
                      />
                      <input
                        type="tel"
                        placeholder="Friend's Phone Number"
                        value={friendNumber}
                        onChange={(e) => setFriendNumber(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none"
                        disabled={sendingInvite}
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleWhatsappInvite}
                          disabled={sendingInvite}
                          className="flex-1 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                        >
                          {sendingInvite ? 'Sending...' : 'Send Invite'}
                        </button>
                        <button
                          onClick={() => {
                            setShowWhatsappForm(false);
                            setInviteStatus(null);
                          }}
                          className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-300 transition-colors"
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
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-12">
              <span className="text-6xl mb-4 block">🚀</span>
              <h3 className="text-3xl font-bold text-gray-800 mb-2">More Exciting Content Coming Soon!</h3>
              <p className="text-xl text-gray-600">
                Stay tuned for weekly puzzles, monthly challenges, and interactive learning games.
              </p>
            </div>
          </section>
        </main>

        {/* PDF Preview Modal */}
        {previewPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
            <div className="relative w-full max-w-4xl rounded-2xl bg-white overflow-hidden">
              <div className="h-[80vh]">
                <iframe src={previewPdf} className="w-full h-full" title="PDF Preview" />
              </div>
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
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