'use client';

import { useState, useEffect, useRef } from 'react';
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
  const [displayedAnswer, setDisplayedAnswer] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileContent, setUploadedFileContent] = useState<string>('');
  const typingSpeed = 20;
  const answerRef = useRef<string>('');
  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFileName(file.name);
        setUploadedFileContent(event.target?.result as string || '');
        toast.success(`Loaded file: ${file.name}`);
      };
      reader.readAsText(file);
    } else {
      toast.error('Please upload a valid .txt file');
    }
  };

  // Format text with bold markers - simplified version
  const formatTextWithBold = (text: string): React.ReactNode => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;
    
    while ((match = regex.exec(text)) !== null) {
      // Add text before the bold section
      if (match.index > lastIndex) {
        parts.push(
          <span key={key++}>
            {text.substring(lastIndex, match.index)}
          </span>
        );
      }
      
      // Add bold text
      parts.push(
        <strong key={key++} className="font-bold text-gray-900">
          {match[1]}
        </strong>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(
        <span key={key++}>
          {text.substring(lastIndex)}
        </span>
      );
    }
    
    return <>{parts}</>;
  };

  // Typewriter effect
  const startTypingAnimation = (fullText: string) => {
    answerRef.current = fullText;
    setDisplayedAnswer('');
    setIsTyping(true);
    
    let currentIndex = 0;
    
    const typeNextCharacter = () => {
      if (currentIndex < fullText.length) {
        setDisplayedAnswer(prev => prev + fullText[currentIndex]);
        currentIndex++;
        setTimeout(typeNextCharacter, typingSpeed);
      } else {
        setIsTyping(false);
      }
    };
    
    typeNextCharacter();
  };

  // Load files from directory
  const loadFiles = async () => {
    setFilesLoading(true);
    try {
      const response = await fetch(`/api/ai-agent/read-files?dir=${encodeURIComponent(directoryPath)}`);
      const data = await response.json();

      if (data.success) {
        setFiles(data.files || []);
        setFileContents(data.contents || {});
        setSelectedFiles(new Set(data.files || []));
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

    // If a file is uploaded, use it as the only context
    let selectedFileContents: FileContent = {};
    if (uploadedFileName && uploadedFileContent) {
      selectedFileContents[uploadedFileName] = uploadedFileContent;
    } else {
      if (selectedFiles.size === 0) {
        toast.error('Please select at least one file or upload a file');
        return;
      }
      selectedFiles.forEach(file => {
        if (fileContents[file]) {
          selectedFileContents[file] = fileContents[file];
        }
      });
    }

    setLoading(true);
    setDisplayedAnswer('');
    setIsTyping(false);

    try {
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
        startTypingAnimation(data.answer);
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

  // Skip typing animation and show full answer
  const skipToFullAnswer = () => {
    if (isTyping && answerRef.current) {
      setDisplayedAnswer(answerRef.current);
      setIsTyping(false);
    }
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
          {/* Left Panel - File Explorer & File Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">📂 Files & Upload</h2>

              {/* File Upload */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload .txt File
                </label>
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {uploadedFileName && (
                  <div className="mt-2 text-xs text-green-700">Uploaded: {uploadedFileName}</div>
                )}
              </div>

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
                  placeholder="e.g., D:\\Downloads\\ai project"
                  disabled={!!uploadedFileName}
                />
              </div>

              {/* Load Files Button */}
              <button
                onClick={loadFiles}
                disabled={filesLoading || !!uploadedFileName}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 mb-4 font-medium"
              >
                {filesLoading ? '⏳ Loading...' : '🔄 Load Files'}
              </button>

              {/* File List */}
              {!uploadedFileName && (
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
              )}

              {/* Summary */}
              {!uploadedFileName && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <p className="text-gray-700">
                    <strong>{selectedFiles.size}</strong> of <strong>{files.length}</strong> files selected
                  </p>
                </div>
              )}
              {uploadedFileName && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-800">
                  Using uploaded file: <strong>{uploadedFileName}</strong>
                </div>
              )}
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
                disabled={loading || (!uploadedFileName && selectedFiles.size === 0)}
                className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium text-lg"
              >
                {loading ? '🤖 Processing...' : '🚀 Get Answer'}
              </button>
            </div>

            {/* Answer Display */}
            {displayedAnswer && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">✨ Answer</h2>
                  {isTyping && (
                    <button
                      onClick={skipToFullAnswer}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Skip animation
                    </button>
                  )}
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <div className="bg-gradient-to-br from-green-50 to-blue-50 p-6 rounded-lg border border-green-200 min-h-[200px]">
                    <div className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                      {formatTextWithBold(displayedAnswer)}
                      {isTyping && (
                        <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse"></span>
                      )}
                    </div>
                    
                    {/* Progress indicator */}
                    {isTyping && (
                      <div className="mt-4">
                        <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 transition-all duration-300"
                            style={{ 
                              width: `${(displayedAnswer.length / answerRef.current.length) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 text-right">
                          {Math.round((displayedAnswer.length / answerRef.current.length) * 100)}% complete
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(answerRef.current || answer);
                      toast.success('Answer copied to clipboard');
                    }}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                  >
                    📋 Copy Answer
                  </button>
                  {!isTyping && (
                    <button
                      onClick={() => startTypingAnimation(answerRef.current)}
                      className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 font-medium flex items-center justify-center gap-2"
                    >
                      🔄 Replay Animation
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!displayedAnswer && (
              <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                <div className="text-gray-500 text-lg mb-4">
                  💡 Ask a question about your files to get started
                </div>
                <div className="text-sm text-gray-400 space-y-2">
                  <p>Example questions:</p>
                  <ul className="space-y-1">
                    <li>"Summarize the main topics in these files"</li>
                    <li>"What are the key findings?"</li>
                    <li>"**Explain** the main concepts"</li>
                    <li>Use **double asterisks** for bold text</li>
                  </ul>
                </div>
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
            <li>✅ Use **text** for bold formatting in your questions</li>
            <li>✅ Answers appear with typing animation like ChatGPT</li>
          </ul>
        </div>
      </div>
    </div>
  );
}