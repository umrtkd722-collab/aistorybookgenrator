// app/api/upload/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { initGridFS , uploadFile } from "@/lib/gridf";
import fs from "fs";
import path from "path";
import os from "os";

export async function POST(req: NextRequest) {
  let tempDir: string | null = null;

  try {
    const user = await getCurrentUser(req);
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await initGridFS();

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];

    if (!files.length) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Create temp dir
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "upload-"));

    const uploadPromises = files.map(async (file, index) => {
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `${user._id}_${Date.now()}_${index}_${file.name}`;
      const tempPath = path.join(tempDir!, filename);

      // Save to temp
      fs.writeFileSync(tempPath, buffer);

      // Upload to GridFS
      const fileId = await uploadFile(tempPath, filename);
      return fileId;
    });

    const fileIds = await Promise.all(uploadPromises);

    return NextResponse.json({ fileIds });

  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 });
  } finally {
    // Cleanup temp files
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}