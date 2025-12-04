// app/api/primetime/admin/reset-assignments/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BoardAllocation from "@/app/models/BoardAllocation";
import User from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { day, timeSlot } = await request.json();

    if (!day || !timeSlot) {
      return NextResponse.json({ error: "Day and timeSlot are required" }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Clear all users from boards for this time slot
      const boards = await BoardAllocation.find({ day, timeSlot }).session(session);

      for (const board of boards) {
        board.users = [];
        board.currentUsers = 0;
        board.lastUpdated = new Date();
        await board.save({ session });
      }

      // Remove competition slot from all users for this day/timeSlot
      await User.updateMany(
        {
          "competitionSlot.day": day,
          "competitionSlot.timeSlot": timeSlot,
        },
        {
          $unset: { competitionSlot: 1 },
        },
        { session }
      );

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: "All users have been unassigned from boards",
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error("Reset assignments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reset assignments" },
      { status: 500 }
    );
  }
}
