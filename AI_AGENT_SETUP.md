# AI Agent Setup Instructions

## 🚀 Quick Start

### Step 1: Install Required Package

Run this command in your project root:

```bash
npm install @google/generative-ai
```

### Step 2: Set Environment Variables

Create or update your `.env.local` file:

```env
GEMINI_API_KEY=AIzaSyDTN8jAXmLSj_BN7FJxEQsjzjlGYHIQUjo
```

### Step 3: Start Development Server

```bash
npm run dev
```

### Step 4: Access the AI Agent

Open your browser and navigate to:

```
http://localhost:3000/ai-agent
```

---

## 📝 What's Included

### 1. **API Routes**

#### `/api/ai-agent/read-files`
- **Method**: GET
- **Purpose**: Read files from a directory
- **Parameters**:
  - `dir` (query): Directory path (e.g., `D:\Downloads\ai project`)
- **Returns**: File list and contents
- **Supported Formats**: `.txt`, `.md`, `.json`, `.csv`, `.xml`, `.html`, `.js`, `.ts`, `.py`, `.java`

**Example:**
```
GET /api/ai-agent/read-files?dir=D:\Downloads\ai project
```

**Response:**
```json
{
  "success": true,
  "directory": "D:\\Downloads\\ai project",
  "files": ["file1.txt", "file2.md"],
  "contents": {
    "file1.txt": "content here...",
    "file2.md": "content here..."
  },
  "count": 2
}
```

#### `/api/ai-agent/process`
- **Method**: POST
- **Purpose**: Process files with Gemini AI
- **Request Body**:
  ```json
  {
    "fileContents": {
      "filename.txt": "file content"
    },
    "question": "Your question here?"
  }
  ```
- **Returns**: AI-generated answer

**Response:**
```json
{
  "success": true,
  "answer": "The answer to your question...",
  "filesProcessed": 1,
  "model": "gemini-2.0-flash",
  "timestamp": "2025-12-16T10:30:00Z"
}
```

### 2. **Frontend Page**

**Location**: `/app/ai-agent/page.tsx`

**Features**:
- 📂 File explorer with directory browsing
- ✅ File selection/deselection
- 👁️ File preview (expandable)
- ❓ Question input area
- 💬 AI response display
- 📋 Copy answer to clipboard

---

## 🎯 How It Works

```
┌─────────────────────────────────────────────────┐
│  1. User enters directory path                  │
│     (Default: D:\Downloads\ai project)          │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  2. Click "Load Files"                          │
│     → Calls /api/ai-agent/read-files            │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  3. Server reads files from directory           │
│     → Returns file list and contents            │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  4. UI displays files                           │
│     → User selects files                        │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  5. User asks question                          │
│     → Clicks "Get Answer"                       │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  6. Frontend sends to /api/ai-agent/process     │
│     → Includes selected file contents           │
│     → Includes user question                    │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  7. Server initializes Gemini AI                │
│     → Creates prompt with file contents         │
│     → Sends to Gemini API                       │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  8. Gemini AI processes request                 │
│     → Analyzes files                            │
│     → Generates answer                          │
└────────────┬────────────────────────────────────┘
             │
             ↓
┌─────────────────────────────────────────────────┐
│  9. Response sent back to frontend              │
│     → Displays answer to user                   │
└─────────────────────────────────────────────────┘
```

---

## 🔒 Security Considerations

1. **Directory Whitelist**: Only `D:\Downloads\ai project` is allowed by default
   - Edit `/api/ai-agent/read-files` to add more allowed directories

2. **File Type Whitelist**: Only specific file types are readable
   - `.txt`, `.md`, `.json`, `.csv`, `.xml`, `.html`, `.js`, `.ts`, `.py`, `.java`
   - Edit the extension list in the route handler to add more types

3. **API Key**: 
   - Should be stored in `.env.local` (not committed to git)
   - Add to `.gitignore`

---

## 💡 Example Queries

Here are some example questions you can ask:

1. **"What is the main topic of these files?"**
2. **"Summarize the content"**
3. **"Extract all important information"**
4. **"What are the key points?"**
5. **"Create a list of topics discussed"**
6. **"Explain the technical concepts"**
7. **"Find all dates and times mentioned"**
8. **"What are the action items?"**

---

## 🧪 Testing

### Test the File Reading API

```bash
curl "http://localhost:3000/api/ai-agent/read-files?dir=D:\Downloads\ai project"
```

### Test the Processing API

```bash
curl -X POST http://localhost:3000/api/ai-agent/process \
  -H "Content-Type: application/json" \
  -d '{
    "fileContents": {"test.txt": "Hello World"},
    "question": "What is in this file?"
  }'
```

---

## 🐛 Troubleshooting

### Issue: "Directory not found"
**Solution**: Make sure the path exists and is spelled correctly

### Issue: "No files loaded"
**Solution**: Check that the directory has supported file types

### Issue: "API Key error"
**Solution**: Verify API key is set in `.env.local`

### Issue: "Access to this directory is not allowed"
**Solution**: Edit allowed paths in `/api/ai-agent/read-files/route.ts`

---

## 📦 Dependencies Added

```bash
npm install @google/generative-ai
```

This package is used to interact with Google's Gemini AI API.

---

## ✅ Checklist

- [ ] Install `@google/generative-ai` package
- [ ] Add `.env.local` file with API key
- [ ] Start development server
- [ ] Navigate to `/ai-agent`
- [ ] Load files from directory
- [ ] Ask a test question
- [ ] Verify answer is displayed

---

**Status**: ✅ Ready to use
**Created**: December 16, 2025
