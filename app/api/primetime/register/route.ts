import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const data = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already registered" },
        { status: 400 }
      );
    }

    // Format time slot correctly
    const timeSlot = data.selectedDay === "saturday" ? "11:30-13:30" : "14:30-16:30";

    // Create new user
    const userData: any = {
      email: data.email,
      name: data.name,
      phone: data.phone,
      userType: data.userType,
      paymentStatus: data.userType === "school" ? "exempted" : "pending",
      amountPaid: data.userType === "school" ? 0 : 100,
      isVerified: data.userType === "school",
      selectedSlot: {
        day: data.selectedDay,
        timeSlot: timeSlot, // Use formatted timeSlot
        selectedAt: new Date(),
      },
    };

    if (data.userType === "school") {
      userData.schoolDetails = {
        schoolName: data.schoolName,
        schoolId: data.schoolId,
        address: data.address,
        city: data.city,
      };
    }

    const user = new User(userData);
    await user.save();

    console.log("User registered successfully:", user.email);

    return NextResponse.json({
      success: true,
      userId: user._id,
      message: "Registration successful",
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: error.message || "Registration failed" }, { status: 500 });
  }
}
