import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/admin-auth';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/app/api/lib/db/models';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentId = params.id;
    const updates = await req.json();

    const { db } = await connectToDatabase();

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;
    delete updates.createdBy;

    const result = await db.collection('content').updateOne(
      { _id: new ObjectId(contentId) },
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
      details: { contentId, updates },
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const contentId = params.id;

    const { db } = await connectToDatabase();

    const result = await db.collection('content').deleteOne({
      _id: new ObjectId(contentId)
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
      details: { contentId },
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