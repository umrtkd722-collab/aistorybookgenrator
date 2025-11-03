import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/User";
// lib/mongo import automatically connect kar dega
import "@/lib/mongo";

export async function GET(req: NextRequest) {
  try {
    // const users = await User.find({});
    return NextResponse.json({ success: true, data: "API is working" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "MongoDB query failed" }, { status: 500 });
  }
}
