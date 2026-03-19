import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/admin-auth';
import { connectToDatabase } from '../../lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Fetch all users from community collection
    const users = await db.collection('community')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    // Format users for frontend
    const formattedUsers = users.map((user:any) => ({
      _id: user._id.toString(),
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      createdAt: user.createdAt ,
      lastActive: user.lastActive || user.updatedAt || new Date().toISOString(),
      otpVerified: user.otpVerified || false,
      source: user.source || 'direct'
    }));

    return NextResponse.json({
      success: true,
      users: formattedUsers
    });

  } catch (error: any) {
    console.error('Error fetching community users:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}