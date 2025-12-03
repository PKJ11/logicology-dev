import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { allocateBoard } from '@/app/services/boardAllocationService';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, day } = await request.json();
    
    if (!userId || !day) {
      return NextResponse.json(
        { error: 'User ID and day are required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.competitionSlot) {
      return NextResponse.json(
        { error: 'Slot already booked' },
        { status: 400 }
      );
    }

    if (user.userType === 'non-school' && user.paymentStatus !== 'completed') {
      return NextResponse.json(
        { error: 'Payment required before booking slot' },
        { status: 400 }
      );
    }

    // Allocate board using balancing algorithm
    const allocation = await allocateBoard(userId);

    // Update user with slot details
    user.competitionSlot = allocation;
    await user.save();

    return NextResponse.json({
      success: true,
      slot: allocation,
      message: 'Slot booked successfully'
    });
  } catch (error: any) {
    console.error('Book slot error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to book slot' },
      { status: 500 }
    );
  }
}