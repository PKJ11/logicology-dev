import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BoardAllocation from "@/app/models/BoardAllocation";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Get all board allocations
    const allocations = await BoardAllocation.find({});

    // Group by day
    const stats = ["saturday", "sunday"].map((day) => {
      const dayAllocations = allocations.filter((a) => a.day === day);

      return {
        _id: day,
        totalUsers: dayAllocations.reduce((sum, alloc) => sum + alloc.currentUsers, 0),
        boards: dayAllocations.map((alloc) => ({
          boardNumber: alloc.boardNumber,
          users: alloc.currentUsers,
          timeSlot: alloc.timeSlot,
          maxUsers: alloc.maxUsers,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error: any) {
    console.error("Board stats error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch board stats" },
      { status: 500 }
    );
  }
}
