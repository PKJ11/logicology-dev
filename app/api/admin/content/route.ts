import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/admin-auth';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/db/models';

// GET handler - Fetch all content or filtered content
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    

    const { searchParams } = new URL(req.url);
    const tierId = searchParams.get('tierId');
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const { db } = await connectToDatabase();
    
    // Build query based on filters
    let query: any = {};
    
    if (tierId) {
      query.tierId = parseInt(tierId);
    }
    
    if (type) {
      query.type = type;
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch content from database
    const content = await db.collection('content')
      .find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .toArray();

    return NextResponse.json({
      success: true,
      content,
      count: content.length
    });

  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST handler - Create new content
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.type || !data.tierId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const newContent = {
      ...data,
      tierId: parseInt(data.tierId),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: admin.id,
      createdByEmail: admin.email,
      // Ensure files and URLs are stored
      files: data.files || [],
      urls: data.urls || [],
      fileCount: data.files?.length || 0,
    };

    const result = await db.collection('content').insertOne(newContent);

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'create_content',
      details: { 
        contentId: result.insertedId, 
        title: data.title,
        type: data.type,
        fileCount: data.files?.length || 0
      },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      content: { ...newContent, _id: result.insertedId },
      message: 'Content created successfully'
    });

  } catch (error: any) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Optional: PUT handler for updating content
export async function PUT(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const updates = await req.json();
    const { db } = await connectToDatabase();

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;
    delete updates.createdBy;

    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updates,
          updatedAt: new Date(),
          updatedBy: admin.id
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'update_content',
      details: { contentId: id, updates },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Content updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Optional: DELETE handler for removing content
export async function DELETE(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('content').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'delete_content',
      details: { contentId: id },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}