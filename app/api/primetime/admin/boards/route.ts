// app/api/primetime/admin/boards/route.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BoardAllocation from "@/app/models/BoardAllocation";
import User from "@/app/models/User";
// REMOVE the User import - it's not needed!

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day") as "saturday" | "sunday";
    const timeSlot = searchParams.get("timeSlot") || "11:30-13:30";

    if (!day) {
      return NextResponse.json({ error: "Day is required" }, { status: 400 });
    }

    // Get or create boards
    let boards = await BoardAllocation.find({ day, timeSlot })
      .sort({ boardNumber: 1 })
      .populate("users", "name email phone userType paymentStatus competitionSlot");

    // If no boards exist, create them
    if (boards.length === 0) {
      console.log(`Creating boards for ${day} ${timeSlot}`);
      const boardPromises = [];
      for (let i = 1; i <= 6; i++) {
        const board = new BoardAllocation({
          boardNumber: i,
          day,
          timeSlot,
          users: [],
          maxUsers: 6,
          currentUsers: 0,
        });
        boardPromises.push(board.save());
      }
      await Promise.all(boardPromises);
      const user = User;

      boards = await BoardAllocation.find({ day, timeSlot })
        .sort({ boardNumber: 1 })
        .populate("users", "name email phone userType paymentStatus competitionSlot");
    }

    return NextResponse.json({
      success: true,
      boards: boards.map((board) => ({
        ...board.toObject(),
        users: board.users || [],
      })),
    });
  } catch (error: any) {
    console.error("Admin boards error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch boards",
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
