import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "@/lib/modals/Users";
import { connectToMongo } from "@/lib/mongo";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password required" },
        { status: 400 }
      );
    }
    await connectToMongo()
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Create response
    const res = NextResponse.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
    });

    // ✅ Store token in HTTP Only Cookie
    res.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // https on prod
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
