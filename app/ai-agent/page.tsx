'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

interface FileContent {
  [filename: string]: string;
}

interface ProcessResponse {
  success: boolean;
  answer?: string;
  error?: string;
  filesProcessed?: number;
}

export default function AIAgentPage() {
  const [directoryPath, setDirectoryPath] = useState<string>('D:\\Downloads\\ai project');
  const [files, setFiles] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<FileContent>({});
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());

  // Load files from directory
  const loadFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await fetch(`/api/ai-agent/read-files?dir=${encodeURIComponent(directoryPath)}`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.files || []);
        setFileContents(data.contents || {});
        setSelectedFiles(new Set(data.files || [])); // Auto-select all files
        toast.success(`Loaded ${data.count} files`);
      } else {
        toast.error(data.error || 'Failed to load files');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error loading files');
    } finally {
      setFilesLoading(false);
    }
  };

  // Process question with AI
  const processQuestion = async () => {
    if (!question.trim()) {
      toast.error('Please enter a question');
      return;
    }

    if (selectedFiles.size === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setLoading(true);
    try {
      // Get content of selected files only
      const selectedFileContents: FileContent = {};
      selectedFiles.forEach(file => {
        if (fileContents[file]) {
          selectedFileContents[file] = fileContents[file];
        }
      });

      const response = await fetch('/api/ai-agent/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileContents: selectedFileContents,
          question: question,
        }),
      });

      const data: ProcessResponse = await response.json();

      if (data.success && data.answer) {
        setAnswer(data.answer);
        toast.success('Answer generated successfully');
      } else {
        toast.error(data.error || 'Failed to generate answer');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error processing question');
    } finally {
      setLoading(false);
    }
  };

  // Toggle file selection
  const toggleFileSelection = (filename: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(filename)) {
      newSelected.delete(filename);
    } else {
      newSelected.add(filename);
    }
    setSelectedFiles(newSelected);
  };

  // Toggle file content visibility
  const toggleFileExpanded = (filename: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filename)) {
      newExpanded.delete(filename);
    } else {
      newExpanded.add(filename);
    }
    setExpandedFiles(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">📁 AI File Agent</h1>
          <p className="text-gray-600">Ask questions about files in your selected directory</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - File Explorer */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📂 Files</h2>

              {/* Directory Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Directory Path
                </label>
                <input
                  type="text"
                  value={directoryPath}
                  onChange={(e) => setDirectoryPath(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., D:\Downloads\ai project"
                />
              </div>

              {/* Load Files Button */}
              <button
                onClick={loadFiles}
                disabled={filesLoading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-4 font-medium"
              >
                {filesLoading ? '⏳ Loading...' : '🔄 Load Files'}
              </button>

              {/* File List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {files.length === 0 ? (
                  <p className="text-gray-500 text-sm">No files loaded</p>
                ) : (
                  files.map((filename) => (
                    <div key={filename} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          checked={selectedFiles.has(filename)}
                          onChange={() => toggleFileSelection(filename)}
                          className="mt-1 w-4 h-4 cursor-pointer"
                        />
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => toggleFileExpanded(filename)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-700 truncate text-left w-full"
                          >
                            {expandedFiles.has(filename) ? '▼' : '▶'} {filename}
                          </button>
                          {expandedFiles.has(filename) && (
                            <div className="mt-2 text-xs bg-gray-100 p-2 rounded max-h-40 overflow-y-auto text-gray-700 whitespace-pre-wrap break-words">
                              {fileContents[filename]?.substring(0, 300)}
                              {fileContents[filename]?.length > 300 ? '...' : ''}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                <p className="text-gray-700">
                  <strong>{selectedFiles.size}</strong> of <strong>{files.length}</strong> files selected
                </p>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat/QA */}
          <div className="lg:col-span-2">
            {/* Question Input */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">❓ Ask a Question</h2>

              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything about the files... e.g., 'What is the main topic?' or 'Summarize the content'"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />

              <button
                onClick={processQuestion}
                disabled={loading || selectedFiles.size === 0}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium text-lg"
              >
                {loading ? '🤖 Processing...' : '🚀 Get Answer'}
              </button>
            </div>

            {/* Answer Display */}
            {answer && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">✨ Answer</h2>
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {answer}
                    </p>
                  </div>
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(answer);
                    toast.success('Answer copied to clipboard');
                  }}
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium"
                >
                  📋 Copy Answer
                </button>
              </div>
            )}

            {/* Empty State */}
            {!answer && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <p className="text-gray-500 text-lg">
                  💡 Ask a question about your files to get started
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-2">ℹ️ How to Use</h3>
          <ul className="text-gray-700 space-y-2">
            <li>✅ Enter the directory path (default: D:\Downloads\ai project)</li>
            <li>✅ Click "Load Files" to fetch all supported file types</li>
            <li>✅ Select the files you want to analyze</li>
            <li>✅ Ask your question and click "Get Answer"</li>
            <li>✅ The AI will analyze the selected files and provide answers</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
