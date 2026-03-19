'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ContentItem, Tier, UploadedFile } from '@/app/types/subscription';

export default function AdminWorksheets() {
  const [worksheets, setWorksheets] = useState<ContentItem[]>([]);
  const [filteredWorksheets, setFilteredWorksheets] = useState<ContentItem[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchWorksheets();
    fetchTiers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [worksheets, searchQuery, selectedTier, selectedDifficulty]);

  const fetchWorksheets = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content?type=worksheet', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setWorksheets(data.content);
        setFilteredWorksheets(data.content);
      }
    } catch (err) {
      console.error('Error fetching worksheets:', err);
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
    let filtered = [...worksheets];

    if (selectedTier !== 'all') {
      filtered = filtered.filter(w => w.tierId === selectedTier);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.category.toLowerCase().includes(query)
      );
    }

    setFilteredWorksheets(filtered);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this worksheet?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchWorksheets();
      }
    } catch (err) {
      console.error('Error deleting worksheet:', err);
    }
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading worksheets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📚 Worksheets Management</h1>
          <p className="mt-2 text-gray-600">
            Total {filteredWorksheets.length} worksheet{filteredWorksheets.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/content/upload?type=worksheet"
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg hover:scale-105 transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Worksheet</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search worksheets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Tiers</option>
              {tiers.map(tier => (
                <option key={tier.id} value={tier.id}>{tier.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Difficulty</label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">🌟 Easy</option>
              <option value="medium">⭐ Medium</option>
              <option value="hard">⚡ Hard</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Worksheets Grid */}
      {filteredWorksheets.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
          <div className="mx-auto mb-4 text-6xl text-gray-400">📄</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Worksheets Found</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first worksheet.</p>
          <Link
            href="/admin/content/upload?type=worksheet"
            className="inline-flex items-center space-x-2 rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
          >
            <span>Create Worksheet</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorksheets.map((worksheet) => (
            <div key={worksheet._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
              {/* Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-orange-100 to-pink-100">
                {worksheet.thumbnail ? (
                  <img src={worksheet.thumbnail} alt={worksheet.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="text-6xl">📄</span>
                  </div>
                )}
                {/* Tier Badge */}
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                    worksheet.tierId === 1 ? 'bg-gray-500' :
                    worksheet.tierId === 2 ? 'bg-blue-500' :
                    worksheet.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
                  }`}>
                    {tiers.find(t => t.id === worksheet.tierId)?.name || `Tier ${worksheet.tierId}`}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{worksheet.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{worksheet.description}</p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {worksheet.category}
                  </span>
                 
                  {worksheet.fileCount && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      📎 {worksheet.fileCount} files
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewPdf(worksheet.files?.[0]?.url || null)}
                    className="flex-1 bg-gray-100 text-gray-700 rounded-xl py-2 text-sm font-medium hover:bg-gray-200"
                  >
                    👁️ Preview
                  </button>
                  <Link
                    href={`/admin/content/edit/${worksheet._id}`}
                    className="flex-1 bg-blue-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-600 text-center"
                  >
                    ✏️ Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(worksheet._id!)}
                    className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-red-600"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
            <div className="h-[80vh]">
              <iframe src={previewPdf} className="w-full h-full" title="PDF Preview" />
            </div>
            <button
              onClick={() => setPreviewPdf(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}