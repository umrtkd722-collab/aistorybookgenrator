import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/sendEmail";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
    }

    const info = await sendContactEmail(name, email, message);

    return NextResponse.json({ success: true, info });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}
