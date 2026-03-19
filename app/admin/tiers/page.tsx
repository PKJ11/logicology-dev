'use client';

import { useState, useEffect } from 'react';
import { Tier } from '../../types/subscription';
import Link from 'next/link';

// Define proper types
interface TierFormData {
  name: string;
  price: number;
  description: string;
  features: string[];
  color: string;
}

export default function TierManagement() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTier, setEditingTier] = useState<Tier | null>(null);
  const [formData, setFormData] = useState<TierFormData>({
    name: '',
    price: 0,
    description: '',
    features: ['✓ Feature 1', '✓ Feature 2', '✓ Feature 3'],
    color: 'from-blue-500 to-blue-600'
  });
  const [featuresText, setFeaturesText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Color options for tiers
  const colorOptions = [
    { value: 'from-gray-500 to-gray-600', label: 'Gray', class: 'bg-gradient-to-r from-gray-500 to-gray-600' },
    { value: 'from-blue-500 to-blue-600', label: 'Blue', class: 'bg-gradient-to-r from-blue-500 to-blue-600' },
    { value: 'from-green-500 to-green-600', label: 'Green', class: 'bg-gradient-to-r from-green-500 to-green-600' },
    { value: 'from-purple-500 to-purple-600', label: 'Purple', class: 'bg-gradient-to-r from-purple-500 to-purple-600' },
    { value: 'from-orange-500 to-orange-600', label: 'Orange', class: 'bg-gradient-to-r from-orange-500 to-orange-600' },
    { value: 'from-pink-500 to-pink-600', label: 'Pink', class: 'bg-gradient-to-r from-pink-500 to-pink-600' },
    { value: 'from-red-500 to-red-600', label: 'Red', class: 'bg-gradient-to-r from-red-500 to-red-600' },
    { value: 'from-yellow-500 to-yellow-600', label: 'Yellow', class: 'bg-gradient-to-r from-yellow-500 to-yellow-600' },
    { value: 'from-indigo-500 to-indigo-600', label: 'Indigo', class: 'bg-gradient-to-r from-indigo-500 to-indigo-600' },
  ];

  useEffect(() => {
    fetchTiers();
  }, []);

  const fetchTiers = async () => {
    setIsLoading(true);
    setError(null);
    
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
        setError(data.error || 'Failed to fetch tiers');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error fetching tiers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (tier: Tier) => {
    setEditingTier(tier);
    setFormData({
      name: tier.name,
      price: tier.price,
      description: tier.description,
      features: tier.features,
      color: tier.color
    });
    setFeaturesText(tier.features.join('\n'));
    setIsEditModalOpen(true);
  };

  const handleAdd = () => {
    setEditingTier(null);
    setFormData({
      name: '',
      price: 0,
      description: '',
      features: ['✓ New feature'],
      color: 'from-blue-500 to-blue-600'
    });
    setFeaturesText('✓ New feature');
    setIsAddModalOpen(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const features = featuresText.split('\n').filter(f => f.trim() !== '');
      
      const tierData = {
        ...formData,
        features,
      };

      let response;
      if (editingTier) {
        // Update existing tier
        response = await fetch(`/api/admin/tiers/${editingTier.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tierData)
        });
      } else {
        // Create new tier
        response = await fetch('/api/admin/tiers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(tierData)
        });
      }

      const data = await response.json();

      if (data.success) {
        await fetchTiers(); // Refresh the list
        setIsEditModalOpen(false);
        setIsAddModalOpen(false);
      } else {
        setError(data.error || 'Failed to save tier');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Error saving tier:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (tierId: number) => {
    if (!confirm('Are you sure you want to delete this tier? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/admin/tiers/${tierId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        await fetchTiers(); // Refresh the list
      } else {
        alert(data.error || 'Failed to delete tier');
      }
    } catch (err) {
      console.error('Error deleting tier:', err);
      alert('Failed to delete tier');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading tiers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tier Management</h1>
          <p className="mt-2 text-gray-600">
            Manage subscription tiers, pricing, and features
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2 text-white shadow-lg shadow-orange-200 transition-all hover:scale-[1.02]"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add New Tier</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-red-700 border border-red-200">
          <div className="flex items-center space-x-2">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Tiers Grid - 3 cards per row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${tier.color} p-6 text-white shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl`}
          >
            {/* Background Pattern */}
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10"></div>
            <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10"></div>

            <div className="relative">
              {/* Header with Tier ID */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{tier.name}</h2>
                <span className="rounded-full bg-white/20 px-3 py-1 text-sm backdrop-blur-sm">
                  Tier {tier.id}
                </span>
              </div>

              {/* Price */}
              <div className="mb-4">
                <span className="text-4xl font-bold">₹{tier.price}</span>
                {tier.price > 0 && <span className="ml-1 text-sm opacity-80">/month</span>}
              </div>

              {/* Description */}
              <p className="mb-4 text-sm opacity-90 line-clamp-2">{tier.description}</p>

              {/* Features List */}
              <div className="space-y-2 min-h-[120px]">
                {tier.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-start space-x-2 text-sm">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="line-clamp-1">{feature}</span>
                  </div>
                ))}
                {tier.features.length > 4 && (
                  <div className="text-xs opacity-75">+{tier.features.length - 4} more features</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex space-x-2">
                <button 
                  onClick={() => handleEdit(tier)}
                  className="flex-1 rounded-lg bg-white/20 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  Edit
                </button>
                {tier.id > 4 && ( // Only allow deleting custom tiers (id > 4)
                  <button 
                    onClick={() => handleDelete(tier.id)}
                    className="rounded-lg bg-white/20 px-3 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-red-500/50"
                    title="Delete Tier"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Content Count Badge */}
              <div className="mt-3 text-xs text-white/60">
                {tier.id === 1 ? 'Free' : `₹${tier.price}/month`}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Add Modal */}
      {(isEditModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">
                {editingTier ? 'Edit Tier' : 'Add New Tier'}
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsAddModalOpen(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="e.g., Premium, Pro, Ultimate"
                  required
                />
              </div>

              {/* Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="0 for free tier"
                  min="0"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Set 0 for free tier</p>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={2}
                  placeholder="Brief description of this tier"
                  required
                />
              </div>

              {/* Features */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Features <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  rows={6}
                  placeholder="Enter each feature on a new line&#10;✓ Feature 1&#10;✓ Feature 2&#10;✓ Feature 3"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Enter each feature on a new line</p>
              </div>

              {/* Color */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Tier Color
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, color: color.value })}
                      className={`h-10 rounded-lg transition-all ${
                        formData.color === color.value 
                          ? 'ring-2 ring-offset-2 ring-orange-500 scale-105' 
                          : 'hover:scale-105'
                      } ${color.class}`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="rounded-xl bg-gray-50 p-4">
                <h4 className="mb-2 text-sm font-medium text-gray-700">Preview</h4>
                <div className={`rounded-xl bg-gradient-to-br ${formData.color} p-4 text-white`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">{formData.name || 'Tier Name'}</span>
                    <span className="text-sm opacity-80">
                      ₹{formData.price}{formData.price > 0 ? '/mo' : ''}
                    </span>
                  </div>
                  <p className="text-xs opacity-90 mb-2 line-clamp-2">{formData.description || 'Description'}</p>
                  <div className="space-y-1">
                    {formData.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="text-xs flex items-center space-x-1">
                        <span>✓</span>
                        <span className="truncate">{f.replace('✓ ', '')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="flex-1 rounded-xl border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-xl bg-orange-500 px-4 py-2 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <span className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span>Saving...</span>
                    </span>
                  ) : (
                    'Save Tier'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}