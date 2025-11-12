import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/lib/modals/Users";
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
   
  const token = (await cookies()).get('accessToken')?.value;

    // const token = authHeader?.replace("Bearer ", "");
   console.log(token ,"token")
    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        { status: 401 }
      );
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
console.log(decoded)
    const user = await User.findById(decoded.userId)
      .select("-passwordHash") // hide pass
      .populate("plan"); // if you want plan details too

      console.log(user , "user") 
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user
    });

  } catch (error: any) {
    console.log(error ,"errro")
    return NextResponse.json(
      { success: false, message: "Invalid or expired token" },
      { status: 401 }
    );
  }
}
