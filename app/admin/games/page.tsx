'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentItem, Tier } from '@/app/types/subscription';

export default function AdminGames() {
  const [games, setGames] = useState<ContentItem[]>([]);
  const [filteredGames, setFilteredGames] = useState<ContentItem[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedGameType, setSelectedGameType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGames();
    fetchTiers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [games, searchQuery, selectedTier, selectedGameType]);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content?type=game,wordwall', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setGames(data.content);
        setFilteredGames(data.content);
      }
    } catch (err) {
      console.error('Error fetching games:', err);
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
    let filtered = [...games];

    if (selectedTier !== 'all') {
      filtered = filtered.filter(g => g.tierId === selectedTier);
    }

    if (selectedGameType !== 'all') {
      filtered = filtered.filter(g => g.type === selectedGameType);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(g => 
        g.title.toLowerCase().includes(query) ||
        g.description.toLowerCase().includes(query)
      );
    }

    setFilteredGames(filtered);
  };

  const getGameIcon = (type: string) => {
    switch (type) {
      case 'wordwall': return '🧩';
      case 'game': return '🎮';
      default: return '🎲';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">🎮 Interactive Games</h1>
          <p className="mt-2 text-gray-600">
            Total {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/content/upload?type=game"
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-green-500 to-green-600 px-4 py-2 text-white shadow-lg hover:scale-105 transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Game</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
          />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
          <select
            value={selectedGameType}
            onChange={(e) => setSelectedGameType(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-green-500 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="game">🎮 Custom Games</option>
            <option value="wordwall">🧩 Wordwall</option>
          </select>
          <button
            onClick={() => {
              setSelectedTier('all');
              setSelectedGameType('all');
              setSearchQuery('');
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div key={game._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all group">
            {/* Game Preview */}
            <div className="relative h-48 bg-gradient-to-br from-green-100 to-blue-100">
              {game.type === 'wordwall' && game.embedCode ? (
                <iframe
                  src={game.embedCode}
                  className="w-full h-full pointer-events-none"
                  title={game.title}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-7xl transform group-hover:scale-110 transition-transform">
                    {getGameIcon(game.type)}
                  </span>
                </div>
              )}
              {/* Type Badge */}
              <div className="absolute top-3 left-3">
                <span className="bg-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
                  {getGameIcon(game.type)} {game.type}
                </span>
              </div>
              {/* Tier Badge */}
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  game.tierId === 1 ? 'bg-gray-500' :
                  game.tierId === 2 ? 'bg-blue-500' :
                  game.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  {tiers.find(t => t.id === game.tierId)?.name || `Tier ${game.tierId}`}
                </span>
              </div>
              {/* Wordwall Header */}
              {game.wordwallHeader && (
                <div className="absolute bottom-3 left-3 right-3">
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">
                    {game.wordwallHeader}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{game.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
              
              {/* Stats */}
              

              {/* Actions */}
              <div className="flex gap-2">
                {game.type === 'wordwall' && game.embedCode ? (
                  <a
                    href={game.embedCode}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-green-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-green-600 text-center"
                  >
                    🎮 Play
                  </a>
                ) : (
                  <button className="flex-1 bg-green-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-green-600">
                    🎮 Play
                  </button>
                )}
                <Link
                  href={`/admin/content/edit/${game._id}`}
                  className="flex-1 bg-blue-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-600 text-center"
                >
                  ✏️ Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}