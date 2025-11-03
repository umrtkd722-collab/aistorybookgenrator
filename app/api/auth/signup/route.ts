import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { User } from "@/lib/modals/Users";

export async function POST(req: NextRequest) {
  try {
  

    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, email, passwordHash });

    return NextResponse.json({ success: true, userId: newUser._id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to create account" }, { status: 500 });
  }
}
