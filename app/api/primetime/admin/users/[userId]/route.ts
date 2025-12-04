// app/api/primetime/admin/users/[userId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import BoardAllocation from "@/app/models/BoardAllocation";
import mongoose from "mongoose";

export async function DELETE(request: NextRequest, context: { params: { userId: string } }) {
  try {
    await dbConnect();

    const userId = context.params.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Valid user ID is required" }, { status: 400 });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find user first
      const user = await User.findById(userId).session(session);
      if (!user) {
        throw new Error("User not found");
      }

      // Remove user from any boards
      if (user.competitionSlot) {
        await BoardAllocation.updateMany(
          {
            day: user.competitionSlot.day,
            timeSlot: user.competitionSlot.timeSlot,
            users: new mongoose.Types.ObjectId(userId),
          },
          {
            $pull: { users: new mongoose.Types.ObjectId(userId) },
            $inc: { currentUsers: -1 },
          },
          { session }
        );
      }

      // Delete the user
      await User.findByIdAndDelete(userId, { session });

      await session.commitTransaction();
      session.endSession();

      return NextResponse.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error: any) {
    console.error("Delete user error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
  }
}
