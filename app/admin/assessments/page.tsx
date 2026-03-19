'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContentItem, Tier } from '@/app/types/subscription';

export default function AdminAssessments() {
  const [assessments, setAssessments] = useState<ContentItem[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<ContentItem[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAssessments();
    fetchTiers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [assessments, searchQuery, selectedTier]);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content?type=assessment', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setAssessments(data.content);
        setFilteredAssessments(data.content);
      }
    } catch (err) {
      console.error('Error fetching assessments:', err);
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
    let filtered = [...assessments];

    if (selectedTier !== 'all') {
      filtered = filtered.filter(a => a.tierId === selectedTier);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query)
      );
    }

    setFilteredAssessments(filtered);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📝 Assessments</h1>
          <p className="mt-2 text-gray-600">
            Total {filteredAssessments.length} assessment{filteredAssessments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/content/upload?type=assessment"
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg hover:scale-105 transition-all"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Create Assessment</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search assessments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          />
          <select
            value={selectedTier}
            onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            {tiers.map(tier => (
              <option key={tier.id} value={tier.id}>{tier.name}</option>
            ))}
          </select>
          <button
            onClick={() => {
              setSelectedTier('all');
              setSearchQuery('');
            }}
            className="rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Assessments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => (
          <div key={assessment._id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
            {/* Header */}
            <div className={`h-2 w-full ${
              assessment.tierId === 1 ? 'bg-gray-500' :
              assessment.tierId === 2 ? 'bg-blue-500' :
              assessment.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
            }`} />

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{assessment.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{assessment.category}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                  assessment.tierId === 1 ? 'bg-gray-500' :
                  assessment.tierId === 2 ? 'bg-blue-500' :
                  assessment.tierId === 3 ? 'bg-purple-500' : 'bg-orange-500'
                }`}>
                  {tiers.find(t => t.id === assessment.tierId)?.name || `Tier ${assessment.tierId}`}
                </span>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assessment.description}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">10</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">30min</div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
                <div className="bg-gray-50 rounded-xl p-2 text-center">
                  <div className="text-lg font-bold text-gray-900">75%</div>
                  <div className="text-xs text-gray-500">Pass Rate</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-orange-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-orange-600">
                  📝 Preview
                </button>
                <Link
                  href={`/admin/content/edit/${assessment._id}`}
                  className="flex-1 bg-blue-500 text-white rounded-xl py-2 text-sm font-medium hover:bg-blue-600 text-center"
                >
                  ✏️ Edit
                </Link>
              </div>

              {/* Results Summary */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Attempts: 156</span>
                  <span className="text-green-600">Avg. Score: 82%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}