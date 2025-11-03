import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/lib/modals/Users";

// import connectMongo from "@/lib/mongo";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: NextRequest) {
  try {

    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ success: false, error: "Email and password required" }, { status: 400 });

    const user = await User.findOne({ email });
    if (!user)
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid)
      return NextResponse.json({ success: false, error: "Invalid credentials" }, { status: 401 });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    return NextResponse.json({ success: true, token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to sign in" }, { status: 500 });
  }
}
