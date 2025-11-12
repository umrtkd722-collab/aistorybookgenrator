// app/api/book/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

import { BookPlan } from "@/lib/modals/Book";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const user = await getCurrentUser(req);
    
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const { id } = await params;
    
    const { title, description } = await req.json();
    
    const bookPlan = await BookPlan.findOneAndUpdate(
      { _id: id, userId: user._id },
      { title, description },
      { new: true }
    );

    if (!bookPlan) return NextResponse.json({ error: "Book not found" }, { status: 404 });

    return NextResponse.json(bookPlan);
  } catch (error: any) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
 
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
const { id } = await params;
    const bookPlan = await BookPlan.findOne({ _id: id, userId: user._id })
      .populate("storyIds")
      .lean();

    if (!bookPlan) return NextResponse.json({ error: "Book not found" }, { status: 404 });

    return NextResponse.json(bookPlan);
  } catch (error: any) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}