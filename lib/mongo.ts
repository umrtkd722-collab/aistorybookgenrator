// lib/db.ts
import mongoose from "mongoose";

// === IMPORT ALL MODELS HERE ===
import "@/lib/modals/Users";
import "@/lib/modals/Plant";
import "@/lib/modals/Book";
import "@/lib/modals/Story";  
import "@/lib/modals/Order";
// ==============================

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("Please define MONGODB_URI in .env");

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // 30s timeout
    };

    console.log(MONGODB_URI, "MONGODB_URI");

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("MongoDB connected");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Auto-connect on import
connectToMongo().catch((err) => {
  console.error("MongoDB connection failed", err);
});
