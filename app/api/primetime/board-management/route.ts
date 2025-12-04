import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import {
  getBoardStats,
  getUserBoard,
  moveUserBetweenBoards,
  rebalanceBoards,
} from "@/app/services/boardAllocationService";
// Import from the correct service file

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const day = searchParams.get("day") as "saturday" | "sunday";
    const userId = searchParams.get("userId");

    if (userId) {
      // Get user's board info
      const userBoard = await getUserBoard(userId);
      return NextResponse.json({
        success: true,
        userBoard,
      });
    }

    // Get board statistics
    const stats = await getBoardStats(day);

    return NextResponse.json({
      success: true,
      stats,
      totalBoards: stats.length,
      totalUsers: stats.reduce((sum, board) => sum + board.currentUsers, 0),
      totalCapacity: stats.reduce((sum, board) => sum + board.maxUsers, 0),
    });
  } catch (error: any) {
    console.error("Board management error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get board stats" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { action, ...data } = await request.json();

    switch (action) {
      case "rebalance":
        const { day, timeSlot } = data;
        if (!day || !timeSlot) {
          return NextResponse.json(
            { error: "Day and timeSlot are required for rebalancing" },
            { status: 400 }
          );
        }
        await rebalanceBoards(day as "saturday" | "sunday", timeSlot);
        return NextResponse.json({
          success: true,
          message: `Boards rebalanced for ${day} ${timeSlot}`,
        });

      case "move-user":
        const { userId, fromBoard, toBoard, day: moveDay, timeSlot: moveTimeSlot } = data;
        if (!userId || !fromBoard || !toBoard || !moveDay || !moveTimeSlot) {
          return NextResponse.json(
            { error: "All parameters are required for moving user" },
            { status: 400 }
          );
        }
        const moved = await moveUserBetweenBoards(
          userId,
          fromBoard,
          toBoard,
          moveDay as "saturday" | "sunday",
          moveTimeSlot
        );
        return NextResponse.json({
          success: moved,
          message: moved
            ? `User moved from board ${fromBoard} to board ${toBoard}`
            : "Failed to move user",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    console.error("Board management error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform board management action" },
      { status: 500 }
    );
  }
}
