import { NextRequest, NextResponse } from 'next/server';

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDqeQ144Mx9kl-2roKdiGY5lGmxKQAgEmE";
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Process files with Gemini AI using direct HTTP fetch
 * POST /api/ai-agent/process
 */
export async function POST(request: NextRequest) {
  try {
    const { fileContents, question } = await request.json();

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      );
    }

    if (!fileContents || Object.keys(fileContents).length === 0) {
      return NextResponse.json(
        { error: 'No file contents provided' },
        { status: 400 }
      );
    }

    // Prepare file content summary with details
    const filesDetails = Object.entries(fileContents)
      .map(([filename, content]) => {
        const contentStr = typeof content === 'string' ? content : JSON.stringify(content);
        return `
File: ${filename}
Size: ${contentStr.length} characters
Content:
\`\`\`
${contentStr}
\`\`\``;
      })
      .join('\n\n---\n\n');

    // Create the prompt
    const prompt = `You are an expert AI assistant that analyzes files and answers questions based on their content.

You have been provided with the following files:

${filesDetails}

Based on the content of these files, please answer the following question:

${question}

Instructions:
- Provide a detailed and accurate answer based solely on the file contents
- If the answer is not found in the files, clearly state that the information is not available in the provided files
- Be concise but thorough in your explanation
- Use specific references to the file contents when applicable`;

    // Call Gemini API using direct HTTP fetch (v1 endpoint)
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      console.error('Gemini API Error:', errorData);
      
      throw new Error(
        `API request failed with status ${apiResponse.status}: ${
          errorData?.error?.message || 'Unknown error'
        }`
      );
    }

    const responseData = await apiResponse.json();
    console.log('Gemini API Response:', responseData);

    // Extract the answer from the response
    if (
      !responseData.candidates ||
      !responseData.candidates[0] ||
      !responseData.candidates[0].content ||
      !responseData.candidates[0].content.parts ||
      !responseData.candidates[0].content.parts[0]
    ) {
      throw new Error('Invalid response structure from Gemini API');
    }

    const answerText = responseData.candidates[0].content.parts[0].text;

    return NextResponse.json({
      success: true,
      answer: answerText,
      model: MODEL_NAME,
      filesProcessed: Object.keys(fileContents).length,
      filesDetails: Object.keys(fileContents),
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error processing with Gemini:', error);
    
    // Provide more helpful error messages
    let errorMessage = error.message || 'Failed to process files with AI';
    
    if (error.message?.includes('429')) {
      errorMessage = 'API quota exceeded. Please try again in a few moments.';
    } else if (error.message?.includes('401') || error.message?.includes('403')) {
      errorMessage = 'Invalid API key or insufficient permissions.';
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: error.status || 500 }
    );
  }
}
