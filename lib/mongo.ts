import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env");

// Global cached connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongo() {
  // Agar pehle se connected hai to return
  if (cached.conn) return cached.conn;

  // Agar connection promise pending hai to wait
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI!).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

// Immediately connect on import
connectToMongo().then(() => {
  console.log("MongoDB connected ✅");
}).catch((err) => {
  console.error("MongoDB connection failed ❌", err);
});
