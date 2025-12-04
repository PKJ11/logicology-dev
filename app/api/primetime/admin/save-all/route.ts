// app/api/primetime/admin/save-all/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BoardAllocation from '@/app/models/BoardAllocation';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { day, timeSlot, boards } = await request.json();

    if (!day || !timeSlot || !boards) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Clear all users from boards for this time slot
      await BoardAllocation.updateMany(
        { day, timeSlot },
        { 
          $set: { users: [], currentUsers: 0 },
          lastUpdated: new Date()
        },
        { session }
      );

      // Update each board with new users
      for (const boardData of boards) {
        const { boardNumber, userIds } = boardData;
        
        if (userIds.length > 6) {
          throw new Error(`Board ${boardNumber} cannot have more than 6 users`);
        }

        const userObjectIds = userIds.map((id: string) => new mongoose.Types.ObjectId(id));

        await BoardAllocation.findOneAndUpdate(
          { boardNumber, day, timeSlot },
          {
            $set: { 
              users: userObjectIds,
              currentUsers: userIds.length,
              lastUpdated: new Date()
            }
          },
          { session, new: true }
        );

        // Update each user's competition slot
        const slotTime = calculateSlotTime(day, timeSlot);
        await User.updateMany(
          { _id: { $in: userIds } },
          {
            $set: {
              competitionSlot: {
                day,
                timeSlot,
                boardNumber,
                slotTime
              }
            }
          },
          { session }
        );
      }

      // Remove competition slot from users not on any board for this time slot
      await User.updateMany(
        {
          'selectedSlot.day': day,
          _id: { $nin: boards.flatMap((b: any) => b.userIds) }
        },
        { $unset: { competitionSlot: 1 } },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: 'All board assignments saved successfully'
      });

    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error: any) {
    console.error('Save all error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save board assignments' },
      { status: 500 }
    );
  }
}

function calculateSlotTime(day: string, timeSlot: string): Date {
  const now = new Date();
  const targetDay = day === 'saturday' ? 6 : 0;
  
  const daysUntilTarget = (targetDay + 7 - now.getDay()) % 7 || 7;
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + daysUntilTarget);
  
  let hours, minutes;
  if (timeSlot === '11:30-13:30') {
    hours = 11;
    minutes = 30;
  } else {
    hours = 14;
    minutes = 30;
  }
  
  nextDay.setHours(hours, minutes, 0, 0);
  return nextDay;
}