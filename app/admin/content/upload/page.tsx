'use client';

import { useState, useEffect } from 'react';
import { ContentUploader } from '../../components/ContentUploader';
import { Tier, TierId } from '@/app/types/subscription';

export default function UploadContent() {
  const [uploadStep, setUploadStep] = useState(1);
  const [contentType, setContentType] = useState('');
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [isLoadingTiers, setIsLoadingTiers] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tierId: 2,
    category: '',
    externalLink: '',
    embedCode: '',
    wordwallHeader: '',
    wordwallIframe: '',
    videoUrl: '', // New field for Mindstamp/YouTube video URL
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  // Fetch tiers from API
  useEffect(() => {
    fetchTiers();
  }, []);

  // Generate video preview URL when videoUrl changes
  useEffect(() => {
    if (contentType === 'mindstamp' && formData.videoUrl) {
      generateVideoPreview(formData.videoUrl);
    } else {
      setVideoPreview(null);
    }
  }, [formData.videoUrl, contentType]);

  const fetchTiers = async () => {
    setIsLoadingTiers(true);
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
        // Set default tierId to the first tier (usually Free) or keep as 2 if available
        if (data.tiers.length > 0) {
          const freeTier = data.tiers.find((t: Tier) => t.price === 0);
          setFormData(prev => ({ 
            ...prev, 
            tierId: freeTier?.id || data.tiers[0].id 
          }));
        }
      } else {
        console.error('Failed to fetch tiers:', data.error);
      }
    } catch (err) {
      console.error('Error fetching tiers:', err);
    } finally {
      setIsLoadingTiers(false);
    }
  };

  const handleUploadComplete = (urls: string[], files: any[]) => {
    setUploadedUrls(urls);
    setUploadedFiles(files);
  };

  // Generate video preview from YouTube URL
  const generateVideoPreview = (url: string) => {
    // YouTube URL patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      // YouTube video ID found
      const videoId = match[1];
      setVideoPreview(`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`);
    } else {
      // Not a YouTube URL, clear preview
      setVideoPreview(null);
    }
  };

  // Generate embed code from YouTube URL
  const generateEmbedCode = (url: string): string => {
    const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(youtubeRegex);
    
    if (match && match[1]) {
      const videoId = match[1];
      return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    
    // If not a YouTube URL, return the original URL as embed (for Mindstamp or other platforms)
    return url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare data based on content type
      let dataToSend: any = {
        ...formData,
        type: contentType,
        files: uploadedFiles,
        urls: uploadedUrls,
        fileCount: uploadedFiles.length,
        thumbnail: uploadedFiles[0]?.url || videoPreview || null
      };

      // For Wordwall, structure the embedCode properly
      if (contentType === 'wordwall' && formData.wordwallIframe) {
        dataToSend.embedCode = formData.wordwallIframe;
        dataToSend.wordwallHeader = formData.wordwallHeader;
      }

      // For Mindstamp/YouTube, generate embed code from URL
      if (contentType === 'mindstamp' && formData.videoUrl) {
        dataToSend.embedCode = generateEmbedCode(formData.videoUrl);
        dataToSend.externalLink = formData.videoUrl; // Store original URL as externalLink
        dataToSend.thumbnail = videoPreview || null;
      }

      // Save to database with file URLs
      const response = await fetch('/api/admin/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      
      if (data.success) {
        // Redirect to content list
        window.location.href = '/admin/content?success=true';
      } else {
        setError(data.error || 'Failed to save content');
      }
    } catch (error) {
      console.error('Error saving content:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingTiers) {
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
          <h1 className="text-3xl font-bold text-gray-900">Upload New Content</h1>
          <p className="mt-2 text-gray-600">
            Step {uploadStep} of 3: {uploadStep === 1 && 'Select content type'}
            {uploadStep === 2 && 'Enter content details'}
            {uploadStep === 3 && (contentType === 'external_link' ? 'Add external link' : 'Upload files')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Step {uploadStep} of 3</span>
          <div className="flex space-x-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full ${
                  step <= uploadStep ? 'bg-orange-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="col-span-2 space-y-6">
          {/* Step 1: Content Type Selection */}
          {uploadStep === 1 && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Select Content Type</h2>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <TypeCard
                  icon="📄"
                  label="Worksheet"
                  selected={contentType === 'worksheet'}
                  onClick={() => setContentType('worksheet')}
                />
                <TypeCard
                  icon="🧩"
                  label="Wordwall"
                  selected={contentType === 'wordwall'}
                  onClick={() => setContentType('wordwall')}
                />
                <TypeCard
                  icon="🎮"
                  label="Game"
                  selected={contentType === 'game'}
                  onClick={() => setContentType('game')}
                />
                <TypeCard
                  icon="🎥"
                  label="Mindstamp/YouTube"
                  selected={contentType === 'mindstamp'}
                  onClick={() => setContentType('mindstamp')}
                />
                <TypeCard
                  icon="📝"
                  label="Assessment"
                  selected={contentType === 'assessment'}
                  onClick={() => setContentType('assessment')}
                />
                <TypeCard
                  icon="🔗"
                  label="External Link"
                  selected={contentType === 'external_link'}
                  onClick={() => setContentType('external_link')}
                />
              </div>
            </div>
          )}

          {/* Step 2: Content Details */}
          {uploadStep === 2 && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Content Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    placeholder="Enter description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Math, Logic, Puzzles"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  />
                </div>
                
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Assign to Tier <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.tierId}
                    onChange={(e) => setFormData({...formData, tierId: Number(e.target.value)})}
                    className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    required
                  >
                    {tiers.map(tier => (
                      <option key={tier.id} value={tier.id}>
                        {tier.name} - ₹{tier.price}/month
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wordwall fields */}
                {contentType === 'wordwall' && (
                  <>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Wordwall Header <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Prime Number Explorer"
                        value={formData.wordwallHeader}
                        onChange={(e) => setFormData({...formData, wordwallHeader: e.target.value})}
                        className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        required={contentType === 'wordwall'}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        This will be displayed as the heading above the Wordwall game
                      </p>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        Wordwall Iframe URL <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        placeholder="https://wordwall.net/embed/play/96298/037/880"
                        value={formData.wordwallIframe}
                        onChange={(e) => setFormData({...formData, wordwallIframe: e.target.value})}
                        className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200 font-mono text-sm"
                        required={contentType === 'wordwall'}
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Paste the full iframe embed URL from Wordwall
                      </p>
                    </div>
                  </>
                )}

                {/* Mindstamp/YouTube Video URL field */}
                {contentType === 'mindstamp' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Video URL <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      required={contentType === 'mindstamp'}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Paste any video URL (YouTube, Vimeo, Mindstamp, etc.)
                    </p>
                    
                    {/* Video Preview */}
                    {videoPreview && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Video Preview:</p>
                        <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden">
                          <img 
                            src={videoPreview} 
                            alt="Video thumbnail" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="mt-2 text-xs text-green-600">
                          ✓ YouTube video detected! Thumbnail loaded.
                        </p>
                      </div>
                    )}

                    {formData.videoUrl && !videoPreview && (
                      <div className="mt-2 text-xs text-blue-600">
                        <p>✓ Custom video URL (will be embedded directly)</p>
                      </div>
                    )}
                  </div>
                )}

                {/* External Link field - shown only for external_link type */}
                {contentType === 'external_link' && (
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      External Link <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.externalLink}
                      onChange={(e) => setFormData({...formData, externalLink: e.target.value})}
                      className="w-full rounded-xl border border-gray-300 p-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                      required={contentType === 'external_link'}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: File Upload - Using EdgeStore */}
          {uploadStep === 3 && contentType !== 'external_link' && contentType !== 'wordwall' && contentType !== 'mindstamp' && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Upload Files</h2>
              
              <ContentUploader
                contentType={contentType as any}
                onUploadComplete={handleUploadComplete}
                maxFiles={contentType === 'worksheet' ? 10 : 5}
              />

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <span className="text-green-600">✓</span>
                          <span className="text-sm font-medium">{file.name}</span>
                        </div>
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline truncate max-w-xs"
                        >
                          {file.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3 for Wordwall - No file upload needed */}
          {uploadStep === 3 && contentType === 'wordwall' && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Wordwall Configuration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your Wordwall game has been configured. No files needed for upload.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Header:</span> {formData.wordwallHeader || 'Not set'}
                </p>
                <p className="text-sm text-blue-800 mt-2 truncate">
                  <span className="font-semibold">Iframe URL:</span> {formData.wordwallIframe || 'Not set'}
                </p>
              </div>
            </div>
          )}

          {/* Step 3 for Mindstamp - Video Preview */}
          {uploadStep === 3 && contentType === 'mindstamp' && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">Video Configuration</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your video has been configured. No files needed for upload.
              </p>
              
              <div className="bg-purple-50 p-4 rounded-lg space-y-3">
                <p className="text-sm text-purple-800">
                  <span className="font-semibold">Video URL:</span> {formData.videoUrl || 'Not set'}
                </p>
                
                {videoPreview && (
                  <div>
                    <p className="text-sm font-medium text-purple-800 mb-2">Preview:</p>
                    <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden">
                      <img 
                        src={videoPreview} 
                        alt="Video thumbnail" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {formData.videoUrl && !videoPreview && (
                  <p className="text-xs text-purple-600">
                    ✓ Custom video URL (will be embedded directly)
                  </p>
                )}

                <p className="text-xs text-purple-600 mt-2">
                  The video will be embedded using the URL provided.
                  {videoPreview && ' YouTube videos will show a thumbnail preview.'}
                </p>
              </div>
            </div>
          )}

          {/* Step 3 for External Links */}
          {uploadStep === 3 && contentType === 'external_link' && (
            <div className="rounded-2xl bg-white p-6 shadow-xl">
              <h2 className="mb-4 text-xl font-bold">External Link</h2>
              <p className="text-sm text-gray-600 mb-4">
                No files needed for external links. Just the URL above will be saved.
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setUploadStep(Math.max(1, uploadStep - 1))}
              className="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              Previous
            </button>
            {uploadStep < 3 ? (
              <button
                onClick={() => setUploadStep(uploadStep + 1)}
                className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                disabled={!contentType && uploadStep === 1}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center space-x-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Publish Content'
                )}
              </button>
            )}
          </div>
        </div>

        {/* Preview Column */}
        <div className="space-y-6">
          <div className="sticky top-24 rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold">Preview</h2>
            {formData.title ? (
              <div className="space-y-3">
                {/* Wordwall Preview */}
                {contentType === 'wordwall' && formData.wordwallHeader && (
                  <h3 className="mb-4 text-center text-xl font-bold text-brand-teal">
                    {formData.wordwallHeader}
                  </h3>
                )}
                
                {contentType === 'wordwall' && formData.wordwallIframe && (
                  <div className="aspect-video h-[300px] overflow-hidden rounded-3xl bg-brand-grayBg sm:h-auto">
                    <iframe
                      className="h-full w-full max-w-[300px] md:max-w-full lg:max-w-full"
                      src={formData.wordwallIframe}
                      frameBorder="0"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                {/* Mindstamp/YouTube Preview */}
                {contentType === 'mindstamp' && formData.videoUrl && (
                  <div className="space-y-3">
                    {videoPreview ? (
                      // YouTube thumbnail preview
                      <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden relative group cursor-pointer"
                           onClick={() => window.open(formData.videoUrl, '_blank')}>
                        <img 
                          src={videoPreview} 
                          alt="Video thumbnail" 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Generic video preview
                      <div className="aspect-video w-full rounded-xl bg-purple-50 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🎥</div>
                          <p className="text-sm text-gray-600">Video URL configured</p>
                          <a 
                            href={formData.videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-purple-600 hover:underline mt-2 inline-block"
                          >
                            Open Video →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <h3 className="font-semibold text-lg">{formData.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-3">{formData.description}</p>
                
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {tiers.find(t => t.id === formData.tierId)?.name || 'Tier'}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {contentType === 'mindstamp' ? 'Video' : contentType || 'Type'}
                  </span>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                    {formData.category || 'Category'}
                  </span>
                </div>

                {contentType === 'external_link' && formData.externalLink && (
                  <div className="mt-2 text-xs text-blue-600 truncate">
                    🔗 {formData.externalLink}
                  </div>
                )}

                {contentType === 'mindstamp' && formData.videoUrl && (
                  <div className="mt-2 text-xs text-purple-600 truncate">
                    🎥 {formData.videoUrl}
                  </div>
                )}

                {uploadedFiles.length > 0 && contentType !== 'wordwall' && contentType !== 'mindstamp' && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Files ({uploadedFiles.length}):
                    </p>
                    <div className="space-y-1">
                      {uploadedFiles.slice(0, 3).map((file, i) => (
                        <div key={i} className="text-xs text-gray-600 truncate">
                          📄 {file.name}
                        </div>
                      ))}
                      {uploadedFiles.length > 3 && (
                        <div className="text-xs text-gray-400">
                          +{uploadedFiles.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <div className="text-4xl mb-2">👁️</div>
                <p className="text-sm">Fill in the details to see preview</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function TypeCard({ icon, label, selected, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-xl border-2 p-4 text-center transition-all ${
        selected
          ? 'border-orange-500 bg-orange-50'
          : 'border-gray-200 hover:border-orange-200 hover:bg-gray-50'
      }`}
    >
      <div className="text-3xl mb-2">{icon}</div>
      <p className={`text-sm font-medium ${selected ? 'text-orange-600' : 'text-gray-600'}`}>
        {label}
      </p>
    </div>
  );
}