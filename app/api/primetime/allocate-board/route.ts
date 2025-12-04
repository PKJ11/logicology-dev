import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import BoardAllocation from "@/app/models/BoardAllocation";
import User from "@/app/models/User";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, day } = await request.json();

    if (!userId || !day) {
      return NextResponse.json({ error: "User ID and day are required" }, { status: 400 });
    }

    console.log(`=== Board Allocation Started ===`);
    console.log(`User ID: ${userId}, Day: ${day}`);

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    console.log(`User: ${user.name} (${user.email})`);

    // Check if user already has a competition slot
    if (user.competitionSlot && user.competitionSlot.boardNumber) {
      console.log("User already has competition slot:", user.competitionSlot);
      return NextResponse.json({
        success: true,
        message: "Board already allocated",
        allocation: user.competitionSlot,
      });
    }

    const timeSlot = day === "saturday" ? "11:30-13:30" : "14:30-16:30";
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Get all boards for this day and timeslot
    let boards = await BoardAllocation.find({ day, timeSlot }).sort({ boardNumber: 1 });
    console.log(`Found ${boards.length} existing boards`);

    // If no boards exist, create all 6 boards
    if (boards.length === 0) {
      console.log("Creating 6 new boards...");
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

      // Refresh boards after creation
      boards = await BoardAllocation.find({ day, timeSlot }).sort({ boardNumber: 1 });
      console.log(`Created ${boards.length} new boards`);
    }

    // Find a board with capacity using atomic operation
    let allocatedBoard = null;
    let attempts = 0;
    const maxAttempts = boards.length * 2; // Try each board at most twice

    while (!allocatedBoard && attempts < maxAttempts) {
      // Sort boards by currentUsers (fewest first) to load balance
      boards.sort((a, b) => (a.currentUsers || 0) - (b.currentUsers || 0));

      for (const board of boards) {
        attempts++;

        // ATOMIC OPERATION: Find board with capacity and update in one operation
        const result = await BoardAllocation.findOneAndUpdate(
          {
            _id: board._id,
            currentUsers: { $lt: 6 }, // CRITICAL: Only update if currentUsers < 6
          },
          {
            $push: { users: userObjectId },
            $inc: { currentUsers: 1 },
            $set: { lastUpdated: new Date() },
          },
          {
            new: true,
            runValidators: true,
          }
        );

        if (result) {
          allocatedBoard = result;
          console.log(`Successfully allocated to board ${allocatedBoard.boardNumber}`);
          break;
        }
      }

      // If no board was found, wait a bit and retry (helps with race conditions)
      if (!allocatedBoard) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    if (!allocatedBoard) {
      return NextResponse.json(
        { error: "All boards are full for this time slot" },
        { status: 400 }
      );
    }

    // Calculate slot time
    const slotTime = calculateSlotTime(day, timeSlot);

    // Update user with competition slot
    user.competitionSlot = {
      day,
      timeSlot,
      boardNumber: allocatedBoard.boardNumber,
      slotTime,
    };

    await user.save();

    console.log(`=== Allocation Completed Successfully ===`);
    console.log(`Board: ${allocatedBoard.boardNumber}, Users: ${allocatedBoard.currentUsers}`);

    return NextResponse.json({
      success: true,
      allocation: {
        boardNumber: allocatedBoard.boardNumber,
        day,
        timeSlot,
        slotTime,
        totalUsersOnBoard: allocatedBoard.currentUsers || 0,
        usersOnBoard: (allocatedBoard.users || []).map((id: any) => id.toString()),
      },
      message: `Successfully allocated to board ${allocatedBoard.boardNumber}`,
    });
  } catch (error: any) {
    console.error("=== Board Allocation Error ===");
    console.error("Error:", error);
    console.error("Stack:", error.stack);
    console.error("=== End Error ===");

    return NextResponse.json(
      { error: error.message || "Failed to allocate board" },
      { status: 500 }
    );
  }
}

function calculateSlotTime(day: string, timeSlot: string): Date {
  const now = new Date();
  const targetDay = day === "saturday" ? 6 : 0;

  const daysUntilTarget = (targetDay + 7 - now.getDay()) % 7 || 7;
  const nextDay = new Date(now);
  nextDay.setDate(now.getDate() + daysUntilTarget);

  let hours, minutes;
  if (timeSlot === "11:30-13:30") {
    hours = 11;
    minutes = 30;
  } else {
    hours = 14;
    minutes = 30;
  }

  nextDay.setHours(hours, minutes, 0, 0);
  return nextDay;
}
