// app/api/quiz-res/route.ts
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";

// Create connection function
async function connectDB() {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        dbName: DB_NAME,
      });
      console.log('Connected to MongoDB');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// Define interface for Quiz Response
interface QuizResponseType {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  isGuest: boolean;
  answers: Map<string, any>;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: Date;
}

// Define Quiz Response Schema directly in the route file
const quizResponseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  answers: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  percentage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create model (prevent model recompilation error)
const QuizResponse = mongoose.models.QuizResponse || 
  mongoose.model('QuizResponse', quizResponseSchema);

// Helper function to safely convert Map to object
function convertAnswersToObject(answers: any): Record<string, any> {
  if (!answers) return {};
  
  // If it's already a plain object, return it
  if (typeof answers === 'object' && !(answers instanceof Map)) {
    return answers;
  }
  
  // If it's a Map, convert to object
  if (answers instanceof Map) {
    const obj: Record<string, any> = {};
    answers.forEach((value, key) => {
      obj[key as string] = value;
    });
    return obj;
  }
  
  // If it's something else, return empty object
  return {};
}

// GET all quiz responses
export async function GET(request: Request) {
  try {
    await connectDB();
    
    // Check if userId is provided in query params
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const questionId = searchParams.get('questionId');
    
    let responses: any[];
    if (userId && questionId) {
      // Get responses for specific user and question
      responses = await QuizResponse.find({ 
        userId: new mongoose.Types.ObjectId(userId),
        [`answers.${questionId}`]: { $exists: true }
      }).lean();
    } else if (userId) {
      // Get responses for specific user
      responses = await QuizResponse.find({ 
        userId: new mongoose.Types.ObjectId(userId) 
      })
        .sort({ createdAt: -1 })
        .lean();
    } else {
      // Get all responses
      responses = await QuizResponse.find({})
        .sort({ createdAt: -1 })
        .lean();
    }
    
    // Safely convert Map objects to plain objects
    const formattedResponses = responses.map(response => {
      // Handle the answers field safely
      const answersObject: Record<string, any> = {};
      
      if (response.answers) {
        if (response.answers instanceof Map) {
          // Convert Map to object
          response.answers.forEach((value: any, key: any) => {
            answersObject[key.toString()] = value;
          });
        } else if (typeof response.answers === 'object') {
          // Already an object, copy it
          Object.assign(answersObject, response.answers);
        }
      }
      
      return {
        _id: response._id ? response._id.toString() : '',
        userId: response.userId ? response.userId.toString() : '',
        userName: response.userName || '',
        isGuest: response.isGuest || false,
        answers: answersObject,
        score: response.score || 0,
        totalQuestions: response.totalQuestions || 0,
        percentage: response.percentage || 0,
        createdAt: response.createdAt || new Date(),
      };
    });
    
    return NextResponse.json({ 
      success: true, 
      data: formattedResponses 
    });
  } catch (error) {
    console.error('Error fetching quiz responses:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz responses' },
      { status: 500 }
    );
  }
}

// POST save quiz response
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    // Calculate score based on correct answers
    // Q1 and Q2 are non-graded, Q3-Q9 are graded
    const correctAnswers: Record<string, string> = {
      '3': 'E',
      '4': 'A',
      '5': 'B',
      '6': 'B',
      '7': 'B',
      '8': 'B',
      '9': 'B'
    };

    let score = 0;
    const totalQuestions = 7; // Q3-Q9

    // Calculate score for graded questions (Q3-Q9)
    for (let i = 3; i <= 9; i++) {
      const questionId = i.toString();
      const userAnswer = body.answers[questionId];
      const correctAnswer = correctAnswers[questionId];
      
      if (userAnswer === correctAnswer) {
        score++;
      }
    }

    const percentage = (score / totalQuestions) * 100;

    // Validate userId
    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create quiz response
    const quizResponse = await QuizResponse.create({
      userId: new mongoose.Types.ObjectId(body.userId),
      userName: body.userName,
      isGuest: body.isGuest || false,
      answers: new Map(Object.entries(body.answers || {})),
      score,
      totalQuestions,
      percentage,
    });

    // Also update the user's first response in guest-user API
    try {
      // Use relative URL for production compatibility
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/guest-user`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: body.userId,
          response: {
            score,
            totalQuestions,
            completedAt: new Date()
          }
        }),
      });
    } catch (updateError) {
      console.error('Error updating user first response:', updateError);
      // Continue even if user update fails
    }

    // Safely convert answers Map to object
    const answersObject: Record<string, any> = {};
    if (quizResponse.answers) {
      if (quizResponse.answers instanceof Map) {
        quizResponse.answers.forEach((value: any, key: any) => {
          answersObject[key.toString()] = value;
        });
      } else if (typeof quizResponse.answers === 'object') {
        Object.assign(answersObject, quizResponse.answers);
      }
    }

    // Format the response for frontend
    const formattedResponse = {
      _id: quizResponse._id ? quizResponse._id.toString() : '',
      userId: quizResponse.userId ? quizResponse.userId.toString() : '',
      userName: quizResponse.userName || '',
      isGuest: quizResponse.isGuest || false,
      score,
      totalQuestions,
      percentage,
      answers: answersObject,
      createdAt: quizResponse.createdAt || new Date(),
    };

    return NextResponse.json({ 
      success: true, 
      data: formattedResponse 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save quiz response' },
      { status: 500 }
    );
  }
}