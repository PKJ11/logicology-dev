/**
 * AI Agent Configuration
 * Customize settings for the AI agent
 */

export const AI_AGENT_CONFIG = {
  // Gemini API Settings
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || "AIzaSyDTN8jAXmLSj_BN7FJxEQsjzjlGYHIQUjo",
    modelName: "gemini-2.0-flash",
    temperature: 0.7,
    maxTokens: 2048,
  },

  // Directory Settings
  directories: {
    // Allowed directories for security
    allowed: [
      "D:\\Downloads\\ai project",
      "D:/Downloads/ai project",
      // Add more directories as needed
      // 'C:\\Users\\YourName\\Documents',
      // '/home/user/documents',
    ],
    // Default directory when page loads
    default: "D:\\Downloads\\ai project",
  },

  // Supported File Types
  files: {
    supportedExtensions: [
      ".txt", // Plain text
      ".md", // Markdown
      ".json", // JSON
      ".csv", // CSV
      ".xml", // XML
      ".html", // HTML
      ".js", // JavaScript
      ".ts", // TypeScript
      ".py", // Python
      ".java", // Java
      ".cpp", // C++
      ".c", // C
      ".css", // CSS
      ".sql", // SQL
      ".sh", // Shell scripts
      ".yml", // YAML
      ".yaml", // YAML
    ],
    // Maximum file size to read (in bytes)
    maxFileSize: 5 * 1024 * 1024, // 5MB
  },

  // UI Settings
  ui: {
    // Maximum files to display in list
    maxFilesDisplay: 100,
    // Maximum preview length (characters)
    maxPreviewLength: 300,
    // Debounce delay for search (ms)
    debounceDelay: 300,
  },

  // System Prompts
  prompts: {
    // System prompt for Gemini
    systemPrompt: `You are an AI assistant specialized in analyzing files and answering questions about their content. 
You should:
1. Provide accurate answers based on the file contents
2. Be clear and concise in your responses
3. Highlight important information
4. If information is not found, clearly state it
5. Use formatting (bullets, lists, etc.) when appropriate`,

    // Default question if user doesn't enter one
    defaultQuestion: "Please summarize the content of these files.",
  },

  // Error Messages
  messages: {
    noQuestion: "Please enter a question before submitting.",
    noFilesSelected: "Please select at least one file before asking.",
    noFilesLoaded: "No files were found in the selected directory.",
    loadingFiles: "Loading files...",
    processing: "Processing your question...",
    success: "Answer generated successfully",
    error: "An error occurred. Please try again.",
  },
};

/**
 * Helper function to check if a file is supported
 */
export function isSupportedFile(filename: string): boolean {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf("."));
  return AI_AGENT_CONFIG.files.supportedExtensions.includes(ext);
}

/**
 * Helper function to add allowed directory
 */
export function addAllowedDirectory(dirPath: string): void {
  if (!AI_AGENT_CONFIG.directories.allowed.includes(dirPath)) {
    AI_AGENT_CONFIG.directories.allowed.push(dirPath);
  }
}

/**
 * Helper function to check if directory is allowed
 */
export function isDirectoryAllowed(dirPath: string): boolean {
  return AI_AGENT_CONFIG.directories.allowed.some((allowed) =>
    dirPath.toLowerCase().includes(allowed.toLowerCase())
  );
}

/**
 * Get the system prompt for API
 */
export function getSystemPrompt(): string {
  return AI_AGENT_CONFIG.prompts.systemPrompt;
}

/**
 * Get supported extensions as comma-separated list
 */
export function getSupportedExtensions(): string {
  return AI_AGENT_CONFIG.files.supportedExtensions.join(", ");
}
