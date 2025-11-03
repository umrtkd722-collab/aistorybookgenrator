import mongoose from "mongoose";
import Grid from "gridfs-stream";
import fs from "fs";
import path from "path";

let gfs: Grid.Grid;

export async function initGridFS() {
  if (gfs) return gfs;
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection("uploads");
  return gfs;
}

export async function uploadFile(filePath: string, filename: string) {
  const gfs = await initGridFS();
  const writeStream = gfs.createWriteStream({ filename });
  fs.createReadStream(filePath).pipe(writeStream);
  return new Promise((resolve, reject) => {
    writeStream.on("close", (file: any) => resolve(file._id));
    writeStream.on("error", (err: any) => reject(err));
  });
}
