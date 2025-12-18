"use client";

import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { FiUpload, FiFolder, FiSearch, FiCopy, FiRefreshCw, FiChevronRight, FiChevronDown, FiSend, FiCheck } from "react-icons/fi";
import { AiOutlineRobot } from "react-icons/ai";

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
  const [directoryPath, setDirectoryPath] = useState<string>("D:\\Downloads\\ai project");
  const [files, setFiles] = useState<string[]>([]);
  const [fileContents, setFileContents] = useState<FileContent>({});
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [question, setQuestion] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [displayedAnswer, setDisplayedAnswer] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [filesLoading, setFilesLoading] = useState<boolean>(false);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [uploadedFileContent, setUploadedFileContent] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const typingSpeed = 20;
  const answerRef = useRef<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when answer updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [displayedAnswer]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedFileName(file.name);
        setUploadedFileContent((event.target?.result as string) || "");
        toast.success(`Loaded file: ${file.name}`);
      };
      reader.readAsText(file);
    } else {
      toast.error("Please upload a valid .txt file");
    }
  };

  // Format text with bold markers
  const formatTextWithBold = (text: string): React.ReactNode => {
    const regex = /\*\*(.*?)\*\*/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let key = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(<span key={key++}>{text.substring(lastIndex, match.index)}</span>);
      }
      parts.push(
        <strong key={key++} className="font-bold text-brand-maroon">
          {match[1]}
        </strong>
      );
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(<span key={key++}>{text.substring(lastIndex)}</span>);
    }

    return <>{parts}</>;
  };

  // Typewriter effect
  const startTypingAnimation = (fullText: string) => {
    answerRef.current = fullText;
    setDisplayedAnswer("");
    setIsTyping(true);

    let currentIndex = 0;

    const typeNextCharacter = () => {
      if (currentIndex < fullText.length) {
        setDisplayedAnswer((prev) => prev + fullText[currentIndex]);
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
      const response = await fetch(
        `/api/ai-agent/read-files?dir=${encodeURIComponent(directoryPath)}`
      );
      const data = await response.json();

      if (data.success) {
        setFiles(data.files || []);
        setFileContents(data.contents || {});
        setSelectedFiles(new Set(data.files || []));
        toast.success(`Loaded ${data.count} files`);
      } else {
        toast.error(data.error || "Failed to load files");
      }
    } catch (error: any) {
      toast.error(error.message || "Error loading files");
    } finally {
      setFilesLoading(false);
    }
  };

  // Process question with AI
  const processQuestion = async () => {
    if (!question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    let selectedFileContents: FileContent = {};
    if (uploadedFileName && uploadedFileContent) {
      selectedFileContents[uploadedFileName] = uploadedFileContent;
    } else {
      if (selectedFiles.size === 0) {
        toast.error("Please select at least one file or upload a file");
        return;
      }
      selectedFiles.forEach((file) => {
        if (fileContents[file]) {
          selectedFileContents[file] = fileContents[file];
        }
      });
    }

    setLoading(true);
    setDisplayedAnswer("");
    setIsTyping(false);

    try {
      const response = await fetch("/api/ai-agent/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
        toast.success("Answer generated successfully");
      } else {
        toast.error(data.error || "Failed to generate answer");
      }
    } catch (error: any) {
      toast.error(error.message || "Error processing question");
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

  // Copy answer to clipboard
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(answerRef.current || answer);
    setCopied(true);
    toast.success("Answer copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-grayBg via-white to-blue-50 font-sans">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-teal to-brand-tealDark">
                <AiOutlineRobot className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-heading">AI File Agent</h1>
                <p className="text-sm text-gray-600">Intelligent document analysis powered by AI</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden rounded-full bg-green-50 px-4 py-2 text-sm text-green-700 md:block">
                <span className="font-medium">Ready to analyze</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Left Panel - File Explorer */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* File Upload Card */}
              <div className="overflow-hidden rounded-2xl bg-white shadow-soft">
                <div className="bg-gradient-to-r from-brand-teal to-brand-tealDark p-4">
                  <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                    <FiUpload className="h-5 w-5" />
                    Upload Files
                  </h2>
                </div>
                <div className="p-4">
                  <label className="group relative block cursor-pointer">
                    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 p-6 transition-all hover:border-brand-teal hover:bg-brand-teal/5">
                      <FiUpload className="mb-3 h-8 w-8 text-gray-400 group-hover:text-brand-teal" />
                      <span className="text-sm font-medium text-gray-600 group-hover:text-brand-teal">
                        Click to upload .txt file
                      </span>
                      <span className="mt-1 text-xs text-gray-500">or drag and drop</span>
                    </div>
                    <input
                      type="file"
                      accept=".txt"
                      onChange={handleFileUpload}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                  {uploadedFileName && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-green-50 p-3">
                      <FiCheck className="h-4 w-4 text-green-600" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-green-800">
                          {uploadedFileName}
                        </p>
                        <p className="text-xs text-green-600">Ready for analysis</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* File Explorer Card */}
              

              {/* Stats Card */}
              <div className="rounded-2xl bg-gradient-to-br from-brand-maroonDark to-brand-maroon p-6 text-white">
                <h3 className="mb-4 text-lg font-semibold">Analysis Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Files Processed</span>
                    <span className="text-xl font-bold">{files.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Selected Files</span>
                    <span className="text-xl font-bold">{selectedFiles.size}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uploaded Files</span>
                    <span className="text-xl font-bold">{uploadedFileName ? 1 : 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Chat Interface */}
          <div className="lg:col-span-3">
            {/* Chat Container */}
            <div className="flex h-[calc(100vh-180px)] flex-col overflow-hidden rounded-2xl bg-white shadow-brand">
              {/* Chat Header */}
              <div className="border-b border-gray-200 bg-gradient-to-r from-brand-teal to-brand-tealDark p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                    <AiOutlineRobot className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">AI Assistant</h2>
                    <p className="text-sm text-white/90">Ask questions about your documents</p>
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto bg-gray-50 p-6">
                {!displayedAnswer ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-teal to-brand-tealDark">
                        <FiSearch className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="mb-2 text-xl font-semibold text-gray-900">Start a Conversation</h3>
                      <p className="mb-6 text-gray-600">
                        Upload files or select from directory, then ask your question
                      </p>
                      <div className="inline-grid grid-cols-2 gap-3">
                        {[
                          "Summarize the main topics",
                          "What are the key findings?",
                          "Explain the concepts",
                          "Compare the documents",
                        ].map((example, i) => (
                          <button
                            key={i}
                            onClick={() => setQuestion(example)}
                            className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-700 transition-all hover:border-brand-teal hover:bg-brand-teal/5 hover:text-brand-teal"
                          >
                            "{example}"
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* User Question */}
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl rounded-br-none bg-gradient-to-r from-brand-teal to-brand-tealDark p-4 text-white">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-xs">You</span>
                          </div>
                          <p className="font-medium">{question}</p>
                        </div>
                      </div>
                    </div>

                    {/* AI Answer */}
                    <div className="flex">
                      <div className="mr-3 flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-brand-maroon to-brand-pink">
                          <AiOutlineRobot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="max-w-[80%]">
                        <div className="rounded-2xl rounded-tl-none bg-white p-6 shadow-soft">
                          <div className="mb-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-brand-maroon to-brand-pink flex items-center justify-center">
                                <span className="text-xs font-semibold text-white">AI</span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                            </div>
                            {isTyping && (
                              <div className="flex items-center gap-2">
                                <div className="flex gap-1">
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-brand-teal"></div>
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-brand-teal [animation-delay:0.1s]"></div>
                                  <div className="h-2 w-2 animate-bounce rounded-full bg-brand-teal [animation-delay:0.2s]"></div>
                                </div>
                                <span className="text-xs text-gray-500">Typing...</span>
                              </div>
                            )}
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <div className="whitespace-pre-wrap leading-relaxed text-gray-800">
                              {formatTextWithBold(displayedAnswer)}
                              {isTyping && (
                                <span className="ml-1 inline-block h-4 w-[2px] animate-pulse bg-brand-teal"></span>
                              )}
                            </div>
                          </div>
                          {isTyping && (
                            <div className="mt-4">
                              <div className="h-1 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full bg-gradient-to-r from-brand-teal to-brand-tealDark transition-all duration-300"
                                  style={{
                                    width: `${(displayedAnswer.length / answerRef.current.length) * 100}%`,
                                  }}
                                ></div>
                              </div>
                              <div className="mt-2 flex items-center justify-between">
                                <button
                                  onClick={skipToFullAnswer}
                                  className="text-xs font-medium text-brand-teal hover:text-brand-tealDark"
                                >
                                  Skip to full answer
                                </button>
                                <span className="text-xs text-gray-500">
                                  {Math.round((displayedAnswer.length / answerRef.current.length) * 100)}%
                                </span>
                              </div>
                            </div>
                          )}
                          {!isTyping && displayedAnswer && (
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                              >
                                {copied ? (
                                  <>
                                    <FiCheck className="h-4 w-4 text-green-600" />
                                    Copied!
                                  </>
                                ) : (
                                  <>
                                    <FiCopy className="h-4 w-4" />
                                    Copy
                                  </>
                                )}
                              </button>
                              <button
                                onClick={() => startTypingAnimation(answerRef.current)}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
                              >
                                <FiRefreshCw className="h-4 w-4" />
                                Replay
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-gray-200 bg-white p-4">
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask anything about your documents..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 pr-12 focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/30 focus:outline-none"
                    rows={3}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        processQuestion();
                      }
                    }}
                  />
                  <button
                    onClick={processQuestion}
                    disabled={loading || (!uploadedFileName && selectedFiles.size === 0)}
                    className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brand-teal to-brand-tealDark text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <FiSend className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-green-500"></div>
                      {selectedFiles.size} files selected
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="h-2 w-2 rounded-full bg-brand-teal"></div>
                      {uploadedFileName ? "Uploaded file" : "Directory files"}
                    </span>
                  </div>
                  <div>
                    Press{" "}
                    <kbd className="rounded bg-gray-200 px-2 py-1 text-xs font-mono">Enter</kbd> to
                    send
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Toast Container Customization */}
      <style jsx global>{`
        .toast {
          background: white;
          border-left: 4px solid #0A8A80;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          font-family: var(--font-roboto), sans-serif;
        }
        .toast-success {
          border-left-color: #10B981;
        }
        .toast-error {
          border-left-color: #E45C48;
        }
      `}</style>
    </div>
  );
}