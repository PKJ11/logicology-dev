// app/api/guest-user/route.ts
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

// Define User Schema directly in the route file
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  isGuest: {
    type: Boolean,
    default: false,
  },
  firstResponse: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastActive: {
    type: Date,
    default: Date.now,
  },
});

// Create model (prevent model recompilation error)
const User = mongoose.models.User || mongoose.model('User', userSchema);

// GET all users or a specific user by ID
export async function GET(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const name = searchParams.get('name');
    
    // If userId is provided, get specific user
    if (userId) {
      const user = await User.findById(userId).lean();
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        success: true, 
        data: user 
      });
    }
    
    // If name is provided, find user by name
    if (name) {
      const user = await User.findOne({ name }).lean();
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({ 
        success: true, 
        data: user 
      });
    }
    
    // Otherwise, get all users
    const users = await User.find({}).sort({ createdAt: -1 }).lean();
    
    return NextResponse.json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST create new user (for guests or named users)
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, error: 'Name is required' },
        { status: 400 }
      );
    }
    
    // Check if user already exists (for named users)
    let user;
    if (!body.isGuest) {
      user = await User.findOne({ name: body.name });
    }
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: body.name,
        isGuest: body.isGuest || false,
        lastActive: new Date(),
      });
    } else {
      // Update last active for existing user
      user = await User.findByIdAndUpdate(
        user._id,
        { lastActive: new Date() },
        { new: true }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        _id: user._id,
        name: user.name,
        isGuest: user.isGuest,
        firstResponse: user.firstResponse,
        createdAt: user.createdAt,
        lastActive: user.lastActive,
      }
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'User with this name already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// PUT update user's first response
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      body.userId,
      { 
        firstResponse: body.response,
        lastActive: new Date() 
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        _id: user._id,
        name: user.name,
        isGuest: user.isGuest,
        firstResponse: user.firstResponse,
        lastActive: user.lastActive,
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

// DELETE user (optional - for cleanup if needed)
export async function DELETE(request: Request) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}