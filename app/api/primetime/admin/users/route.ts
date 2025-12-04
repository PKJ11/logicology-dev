// app/api/primetime/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get('day') as 'saturday' | 'sunday';

    // Find ALL users who selected this day
    const users = await User.find({
      'selectedSlot.day': day
    }).select('name email phone userType paymentStatus competitionSlot selectedSlot');

    return NextResponse.json({
      success: true,
      users: users.map(user => ({
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        userType: user.userType,
        paymentStatus: user.paymentStatus,
        competitionSlot: user.competitionSlot,
        selectedSlot: user.selectedSlot
      }))
    });
  } catch (error: any) {
    console.error('Admin users error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}