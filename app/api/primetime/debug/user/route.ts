import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";
import BoardAllocation from "@/app/models/BoardAllocation";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({
        error: "User not found",
      });
    }

    // Get all board allocations
    const boardAllocations = await BoardAllocation.find({});

    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        competitionSlot: user.competitionSlot,
        selectedSlot: user.selectedSlot,
        paymentStatus: user.paymentStatus,
        isVerified: user.isVerified,
      },
      boardAllocations: boardAllocations.map((board) => ({
        boardNumber: board.boardNumber,
        day: board.day,
        timeSlot: board.timeSlot,
        currentUsers: board.currentUsers,
        maxUsers: board.maxUsers,
        users: board.users,
      })),
      totalBoards: boardAllocations.length,
    });
  } catch (error: any) {
    console.error("Debug error:", error);
    return NextResponse.json({ error: error.message || "Debug failed" }, { status: 500 });
  }
}
