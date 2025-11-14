// app/api/gridfs/image/[fileId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToMongo } from "@/lib/mongo";
export const dynamic = "force-dynamic";
interface RouteContext {
  params: Promise<{ fileId: string }>;
}
export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    await connectToMongo();
    const params = await context.params
    const { fileId } =  params; // ← await params → phir destructure
    console.log(fileId , "fileId")
    if (!mongoose.Types.ObjectId.isValid(fileId)) {
      return new NextResponse("Invalid file ID", { status: 400 });
    }

    const db = mongoose.connection.db;
    if (!db) {
      return new NextResponse("DB not connected", { status: 500 });
    }

    const bucket = new mongoose.mongo.GridFSBucket(db, {
      bucketName: "uploads", // YE CHECK KAR — fs ya uploads?
    });

    const objectId = new mongoose.Types.ObjectId(fileId);

    // Check if file exists
    const file = await db.collection("uploads.files").findOne({ _id: objectId });
    if (!file) {
      return new NextResponse("Image not found", { status: 404 });
    }

    const stream = bucket.openDownloadStream(objectId);

    return new NextResponse(stream as any , {
      headers: {
        "Content-Type": file.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
        "Content-Disposition": `inline; filename="${file.filename}"`,
      },
    });
  } catch (error: any) {
    console.error("GridFS error:", error);
    return new NextResponse("Failed to load image", { status: 500 });
  }
}