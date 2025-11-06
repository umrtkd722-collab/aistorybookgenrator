// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/lib/modals/Users";
import { Plan } from "@/lib/modals/Plant";


export async function POST(req: NextRequest) {
  try {
    
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email already registered" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Find Starter Plan
    const starterPlan = await Plan.findOne({ name: "Starter" });
    if (!starterPlan) {
      return NextResponse.json(
        { success: false, error: "Starter plan not found in DB" },
        { status: 500 }
      );
    }

    // Create User with Starter Plan
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      plan: starterPlan._id,           // ← Plan assigned
      planStartDate: new Date(),       // ← Start date
      isVerified: false,
    });

    return NextResponse.json({
      success: true,
      message: "Account created with Starter plan!",
      userId: newUser._id,
      plan: starterPlan.name,
    });

  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create account" },
      { status: 500 }
    );
  }
}