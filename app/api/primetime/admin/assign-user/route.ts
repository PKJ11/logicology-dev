// app/api/primetime/admin/assign-user/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import BoardAllocation from '@/app/models/BoardAllocation';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, boardNumber, day, timeSlot, action } = await request.json();

    if (!userId || !boardNumber || !day || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Find the board
      const board = await BoardAllocation.findOne({ 
        boardNumber, 
        day, 
        timeSlot 
      }).session(session);

      if (!board) {
        throw new Error('Board not found');
      }

      if (action === 'add') {
        // Check if board is full
        if (board.currentUsers >= board.maxUsers) {
          throw new Error(`Board ${boardNumber} is already full`);
        }

        // Check if user is already on this board
        const userOnBoard = board.users.some((id:any) => id.toString() === userId);
        if (userOnBoard) {
          throw new Error('User is already on this board');
        }

        // Remove user from any other board first
        await BoardAllocation.updateMany(
          { 
            day, 
            timeSlot,
            users: userObjectId 
          },
          { 
            $pull: { users: userObjectId },
            $inc: { currentUsers: -1 }
          },
          { session }
        );

        // Add user to new board
        board.users.push(userObjectId);
        board.currentUsers = board.users.length;
        board.lastUpdated = new Date();
        await board.save({ session });

        // Update user's competition slot
        const slotTime = calculateSlotTime(day, timeSlot);
        await User.findByIdAndUpdate(
          userId,
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

      } else if (action === 'remove') {
        // Remove user from board
        const userIndex = board.users.findIndex((id:any) => id.toString() === userId);
        if (userIndex === -1) {
          throw new Error('User not found on this board');
        }

        board.users.splice(userIndex, 1);
        board.currentUsers = board.users.length;
        board.lastUpdated = new Date();
        await board.save({ session });

        // Remove competition slot from user
        await User.findByIdAndUpdate(
          userId,
          { $unset: { competitionSlot: 1 } },
          { session }
        );
      }

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: `User ${action === 'add' ? 'added to' : 'removed from'} board ${boardNumber}`
      });

    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }

  } catch (error: any) {
    console.error('Assign user error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to assign user' },
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