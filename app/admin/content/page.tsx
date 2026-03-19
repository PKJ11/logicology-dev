'use client';

import { useState, useEffect } from 'react';
import { ContentItem, UploadedFile, Tier } from '../../types/subscription';
import Link from 'next/link';

export default function ContentManagement() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ContentItem[]>([]);
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch content and tiers from API
  useEffect(() => {
    Promise.all([fetchContent(), fetchTiers()]).then(() => {
      setIsLoading(false);
    });
  }, []);

  // Apply filters whenever filters or items change
  useEffect(() => {
    applyFilters();
  }, [items, selectedTier, selectedType, searchQuery]);

  const fetchContent = async () => {
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setItems(data.content);
        setFilteredItems(data.content);
      } else {
        setError(data.error || 'Failed to fetch content');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching content:', err);
    }
  };

  const fetchTiers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/admin/tiers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTiers(data.tiers);
      } else {
        console.error('Failed to fetch tiers:', data.error);
      }
    } catch (err) {
      console.error('Error fetching tiers:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Filter by tier
    if (selectedTier !== 'all') {
      filtered = filtered.filter(item => item.tierId === selectedTier);
    }

    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    setFilteredItems(filtered);
  };

  // Check for upload success message
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('upload') === 'success') {
      alert('Content uploaded successfully!');
      // Remove the query parameter
      window.history.replaceState({}, '', '/admin/content');
      // Refresh the content list
      fetchContent();
    }
  }, []);

  // Helper function to get tier name by ID
  const getTierName = (tierId: number) => {
    const tier = tiers.find(t => t.id === tierId);
    return tier ? `${tier.name} (₹${tier.price})` : `Tier ${tierId}`;
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 text-6xl text-red-500">⚠️</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Error Loading Content</h3>
          <p className="mb-4 text-gray-600">{error}</p>
          <button
            onClick={fetchContent}
            className="rounded-xl bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
          <p className="mt-2 text-gray-600">
            Total {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} 
            {items.length !== filteredItems.length && ` (filtered from ${items.length})`}
          </p>
        </div>
        <Link
          href="/admin/content/upload"
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Upload New Content</span>
        </Link>
      </div>

      {/* Filters */}
      <div className="rounded-2xl bg-white p-6 shadow-xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              placeholder="Search by title, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Tier</label>
            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="all">All Tiers</option>
              {tiers.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name} (₹{tier.price})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Filter by Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
            >
              <option value="all">All Types</option>
              <option value="worksheet">📄 Worksheets</option>
              <option value="wordwall">🧩 Wordwall</option>
              <option value="game">🎮 Games</option>
              <option value="mindstamp">🎥 Mindstamp Videos</option>
              <option value="assessment">📝 Assessments</option>
              <option value="external_link">🔗 External Links</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-xl">
          <div className="mx-auto mb-4 text-6xl text-gray-400">📭</div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">No Content Found</h3>
          <p className="mb-6 text-gray-600">
            {items.length === 0 
              ? 'Get started by uploading your first content item.' 
              : 'No items match your current filters.'}
          </p>
          {items.length === 0 ? (
            <Link
              href="/admin/content/upload"
              className="inline-flex items-center space-x-2 rounded-xl bg-orange-500 px-6 py-3 text-white hover:bg-orange-600"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Upload Your First Content</span>
            </Link>
          ) : (
            <button
              onClick={() => {
                setSelectedTier('all');
                setSelectedType('all');
                setSearchQuery('');
              }}
              className="rounded-xl bg-gray-100 px-6 py-2 text-gray-700 hover:bg-gray-200"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ContentCard 
              key={item._id} 
              item={item} 
              onRefresh={fetchContent}
              tiers={tiers}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Update ContentCard to handle file URLs with proper typing and Wordwall rendering
function ContentCard({ item, onRefresh, tiers }: { item: ContentItem; onRefresh: () => void; tiers: Tier[] }) {
  console.log('Rendering ContentCard for item:', item); // Debug log to check item structure

  const typeColors = {
    worksheet: 'bg-green-100 text-green-800 border-green-200',
    wordwall: 'bg-blue-100 text-blue-800 border-blue-200',
    game: 'bg-purple-100 text-purple-800 border-purple-200',
    mindstamp: 'bg-red-100 text-red-800 border-red-200',
    assessment: 'bg-orange-100 text-orange-800 border-orange-200',
    external_link: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  const typeIcons = {
    worksheet: '📄',
    wordwall: '🧩',
    game: '🎮',
    mindstamp: '🎥',
    assessment: '📝',
    external_link: '🔗',
  };

  // Get tier details
  const tierDetails = tiers.find(t => t.id === item.tierId);
  const tierColor = tierDetails?.color || (
    item.tierId === 1 ? 'bg-gray-500' :
    item.tierId === 2 ? 'bg-blue-500' :
    item.tierId === 3 ? 'bg-purple-500' :
    'bg-orange-500'
  );

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/content?id=${item._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete content');
      }
    } catch (error) {
      console.error('Error deleting content:', error);
      alert('Failed to delete content');
    }
  };

  // Helper function to get display ID
  const getDisplayId = () => {
    if (!item._id) return 'N/A';
    if (item._id.length >= 6) {
      return item._id.slice(-6);
    }
    return item._id;
  };

  // Render Wordwall preview
  const renderWordwallPreview = () => {
    if (item.type !== 'wordwall' || !item.embedCode) return null;
    
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">Wordwall Preview:</h4>
        <div className="aspect-video h-[200px] overflow-hidden rounded-xl bg-white">
          <iframe
            className="h-full w-full"
            src={item.embedCode}
            frameBorder="0"
            allowFullScreen
            title={item.title}
          ></iframe>
        </div>
        {item.wordwallHeader && (
          <p className="mt-2 text-xs text-blue-600 font-medium">
            Header: {item.wordwallHeader}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl">
      {/* Tier Badge */}
      <div className={`absolute -right-12 top-6 rotate-45 px-12 py-1 text-xs font-semibold text-white ${tierColor}`}>
        {tierDetails?.name || `Tier ${item.tierId}`}
      </div>

      {/* Thumbnail - Show Wordwall preview if available */}
      <div className="mb-4 h-40 w-full overflow-hidden rounded-xl bg-gray-100">
        {item.type === 'wordwall' && item.embedCode ? (
          <iframe
            src={item.embedCode}
            className="h-full w-full"
            frameBorder="0"
            scrolling="no"
            title={item.title}
          />
        ) : item.thumbnail ? (
          <img 
            src={item.thumbnail} 
            alt={item.title} 
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-400">
            {typeIcons[item.type]}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          <span className={`rounded-full border px-2 py-1 text-xs font-medium ${typeColors[item.type]}`}>
            {typeIcons[item.type]} {item.type}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

        <div className="flex items-center space-x-2 text-xs">
          <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
            {item.category}
          </span>
          {item.fileCount !== undefined && item.fileCount > 0 && (
            <span className="text-gray-500">
              {item.fileCount} file(s)
            </span>
          )}
        </div>

        {/* Display Wordwall header if present */}
        {item.type === 'wordwall' && item.wordwallHeader && (
          <div className="mt-2 text-xs font-medium text-blue-600">
            🧩 Header: {item.wordwallHeader}
          </div>
        )}

        {/* Display uploaded files */}
        {item.files && Array.isArray(item.files) && item.files.length > 0 && item.type !== 'wordwall' && (
          <div className="mt-2 space-y-1">
            <p className="text-xs font-medium text-gray-500">Files:</p>
            {item.files.map((file: UploadedFile, index: number) => (
              <div key={index} className="flex items-center space-x-1 text-xs">
                <span className="text-blue-500">🔗</span>
                <a 
                  href={file.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate max-w-[150px]"
                  title={file.name}
                >
                  {file.name}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Display external link if present */}
        {item.externalLink && (
          <div className="mt-2 flex items-center space-x-1 text-xs">
            <span className="text-blue-500">🔗</span>
            <a 
              href={item.externalLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              {item.externalLink}
            </a>
          </div>
        )}

        {/* Display embed code indicator for Mindstamp */}
        {item.embedCode && item.type === 'mindstamp' && (
          <div className="mt-2 flex items-center space-x-1 text-xs text-purple-600">
            <span>🎥</span>
            <span>Interactive Video</span>
          </div>
        )}

        {/* Wordwall Preview Button */}
        {item.type === 'wordwall' && item.embedCode && (
          <div className="mt-2">
            <button
              onClick={() => window.open(item.embedCode, '_blank')}
              className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
            >
              🧩 Open Wordwall Game
            </button>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
          <span>ID: {getDisplayId()}</span>
          {item.createdAt && (
            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4">
          <button className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
            Edit
          </button>
          <button 
            onClick={() => {
              if (item.type === 'wordwall' && item.embedCode) {
                window.open(item.embedCode, '_blank');
              } else if (item.files && item.files.length > 0) {
                window.open(item.files[0].url, '_blank');
              } else if (item.externalLink) {
                window.open(item.externalLink, '_blank');
              }
            }}
            className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600"
          >
            Preview
          </button>
          <button 
            onClick={handleDelete}
            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Full Wordwall Preview (expandable) */}
        {/* {renderWordwallPreview()} */}
      </div>
    </div>
  );
}