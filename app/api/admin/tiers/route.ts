import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/db/models';
import { verifyAdmin } from '@/app/lib/admin-auth';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const admin = await verifyAdmin(req);
    

    const { db } = await connectToDatabase();
    const tiers = await db.collection('tiers')
      .find({})
      .sort({ id: 1 })
      .toArray();

    return NextResponse.json({
      success: true,
      tiers
    });
  } catch (error: any) {
    console.error('Error fetching tiers:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

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
    const { db } = await connectToDatabase();

    // Get the highest tier ID for new tier
    const highestTier = await db.collection('tiers')
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const newId = highestTier.length > 0 ? highestTier[0].id + 1 : 5;

    const newTier = {
      id: newId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('tiers').insertOne(newTier);

    // Log activity
    await db.collection('admin_activities').insertOne({
      adminId: admin.id,
      action: 'create_tier',
      details: { tierId: newId, tierName: data.name },
      timestamp: new Date()
    });

    return NextResponse.json({
      success: true,
      tier: newTier
    });
  } catch (error: any) {
    console.error('Error creating tier:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}