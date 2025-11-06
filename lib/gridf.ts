// lib/gridf.ts
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let bucket: GridFSBucket;

export async function initGridFS() {
  if (bucket) return bucket;

  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(process.env.MONGODB_URI!);
  }

  bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db!, {
    bucketName: "uploads",
  });

  return bucket;
}

// Upload file
export async function uploadFile(filePath: string, filename: string): Promise<string> {
  const bucket = await initGridFS();
  const uploadStream = bucket.openUploadStream(filename);
  const readStream = require("fs").createReadStream(filePath);

  return new Promise((resolve, reject) => {
    readStream
      .pipe(uploadStream)
      .on("error", reject)
      .on("finish", () => resolve(uploadStream.id.toString()));
  });
}

// Download file as Buffer
export async function downloadFromGridFS(fileId: string): Promise<Buffer> {
  const bucket = await initGridFS();
  const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    downloadStream
      .on("data", (chunk) => chunks.push(chunk))
      .on("end", () => resolve(Buffer.concat(chunks)))
      .on("error", reject);
  });
}

// Delete file (optional)
export async function deleteFile(fileId: string): Promise<void> {
  const bucket = await initGridFS();
  await bucket.delete(new mongoose.Types.ObjectId(fileId));
}