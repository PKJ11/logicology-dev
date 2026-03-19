import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/app/api/lib/db/models';
import { verifyAdmin } from '@/app/lib/admin-auth';

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

    const tierId = parseInt(params.id);
    const updates = await req.json();

    const { db } = await connectToDatabase();

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.id;
    delete updates.createdAt;

    const result = await db.collection('tiers').updateOne(
      { id: tierId },
      {
        $set: {
          ...updates,
          updatedAt: new Date()
        }
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Tier not found' },
        { status: 404 }
      );
    }

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'update_tier',
      details: { tierId, updates },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Tier updated successfully'
    });
  } catch (error: any) {
    console.error('Error updating tier:', error);
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

    const tierId = parseInt(params.id);

    // Don't allow deleting base tiers (1-4)
    if (tierId <= 4) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete base tiers' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('tiers').deleteOne({ id: tierId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Tier not found' },
        { status: 404 }
      );
    }

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'delete_tier',
      details: { tierId },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Tier deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting tier:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}