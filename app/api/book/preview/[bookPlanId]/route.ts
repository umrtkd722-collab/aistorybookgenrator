// app/api/book/preview/[bookPlanId]/route.ts
import { NextRequest, NextResponse } from "next/server";

import { BookPlan } from "@/lib/modals/Book";
import { Story } from "@/lib/modals/Story";
import { initGridFS } from "@/lib/gridf";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { bookPlanId: string } }
) {
  try {

    const { bookPlanId } = await params;
 
    if (!mongoose.Types.ObjectId.isValid(bookPlanId)) {
      return NextResponse.json({ error: "Invalid bookPlanId" }, { status: 400 });
    }

    // Find BookPlan
    const bookPlan = await BookPlan.findById(bookPlanId)
      .populate("storyIds")
      .lean();

    if (!bookPlan) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Get first story for PDF
    const story = await Story.findById(bookPlan.storyIds[0]).lean();
    if (!story || !story.pdfFileId) {
      return NextResponse.json({ error: "PDF not generated" }, { status: 404 });
    }

    // Stream PDF from GridFS
    const bucket = await initGridFS();
    const fileId = new mongoose.Types.ObjectId(story.pdfFileId);
    const file = await bucket.find({ _id: fileId }).next();

    if (!file) {
      return NextResponse.json({ error: "PDF file missing" }, { status: 404 });
    }

    const downloadStream = bucket.openDownloadStream(fileId);

    return new NextResponse(downloadStream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${bookPlan.title}.pdf"`,
        "Cache-Control": "no-cache",
      },
    });

  } catch (error: any) {
    console.error("Preview error:", error);
    return NextResponse.json({ error: "Failed to load preview" }, { status: 500 });
  }
}