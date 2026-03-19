'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentItem, Tier } from '@/app/types/subscription';

export default function AdminVideos() {
  const [videos, setVideos] = useState<ContentItem[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<ContentItem[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
    fetchTiers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [videos, searchQuery, selectedTier, selectedPlatform]);

  const fetchVideos = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content?type=mindstamp', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setVideos(data.content);
        setFilteredVideos(data.content);
      }
    } catch (err) {
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTiers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTiers(data.tiers);
    } catch (err) {
      console.error('Error fetching tiers:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...videos];

    if (selectedTier !== 'all') {
      filtered = filtered.filter(v => v.tierId === selectedTier);
    }

    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(v => {
        const url = v.externalLink || v.embedCode || '';
        if (selectedPlatform === 'youtube') return url.includes('youtube') || url.includes('youtu.be');
        if (selectedPlatform === 'vimeo') return url.includes('vimeo');
        if (selectedPlatform === 'mindstamp') return url.includes('mindstamp');
        return true;
      });
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(v => 
        v.title.toLowerCase().includes(query) ||
        v.description.toLowerCase().includes(query)
      );
    }

    setFilteredVideos(filtered);
  };

  const getVideoPlatform = (video: ContentItem) => {
    const url = video.externalLink || video.embedCode || '';
    if (url.includes('youtube') || url.includes('youtu.be')) return 'youtube';
    if (url.includes('vimeo')) return 'vimeo';
    if (url.includes('mindstamp')) return 'mindstamp';
    return 'other';
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'youtube': return '📺';
      case 'vimeo': return '🎥';
      case 'mindstamp': return '🎬';
      default: return '📹';
    }
  };

  const extractVideoId = (url: string) => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎥 Video Lessons</h1>
          <p className="mt-2 text-gray-600">
            Total {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/content/upload?type=mindstamp"
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-4 py-2 text-white shadow-lg hover:scale-105 transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Video</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search videos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
          />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none"
          >
            <option value="all">All Platforms</option>
            <option value="youtube">📺 YouTube</option>
            <option value="vimeo">🎥 Vimeo</option>
            <option value="mindstamp">🎬 Mindstamp</option>
          </select>
          <button
            onClick={() => {
              setSelectedTier('all');
              setSelectedPlatform('all');
              setSearchQuery('');
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => {
          const platform = getVideoPlatform(video);
          const videoId = video.externalLink ? extractVideoId(video.externalLink) : null;
          const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : video.thumbnail;

          return (
            <div key={video._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              {/* Thumbnail */}
              <div className="relative h-48 bg-black cursor-pointer group" onClick={() => setPlayingVideo(video._id!)}>
                {thumbnail ? (
                  <img src={thumbnail} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-100 to-pink-100">
                    <span className="text-6xl">{getPlatformIcon(platform)}</span>
                  </div>
                )}
                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Platform Badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-xs">
                    {getPlatformIcon(platform)} {platform}
                  </span>
                </div>
                {/* Tier Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    video.tierId === 1 ? 'bg-gray-500' :
                    video.tierId === 2 ? 'bg-blue-500' :
                    video.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                    {tiers.find(t => t.id === video.tierId)?.name || `Tier ${video.tierId}`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                
                {/* Metadata */}
                {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span>⏱️ {video.duration || '5:30'}</span>
                  <span>•</span>
                  <span>👁️ {video.views || '0'} views</span>
                </div> */}

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPlayingVideo(video._id!)}
                    className="flex-1 bg-purple-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-purple-600"
                  >
                    ▶ Play
                  </button>
                  <Link
                    href={`/admin/content/edit/${video._id}`}
                    className="flex-1 bg-blue-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-600 text-center"
                  >
                    ✏️ Edit
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal */}
      {playingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <div className="relative w-full max-w-5xl">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              Close ✕
            </button>
            <div className="relative pt-[56.25%]">
              {videos.find(v => v._id === playingVideo)?.embedCode ? (
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={videos.find(v => v._id === playingVideo)?.embedCode}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  className="absolute top-0 left-0 w-full h-full"
                  controls
                  autoPlay
                  src={videos.find(v => v._id === playingVideo)?.externalLink}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}