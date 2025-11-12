// lib/db.ts
import mongoose from "mongoose";

// === IMPORT ALL MODELS HERE ===
import "@/lib/modals/Users";
import "@/lib/modals/Plant";
import "@/lib/modals/Book";
import "@/lib/modals/Story";     // YE ZAROORI HAI
import "@/lib/modals/Order";
// ==============================

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) throw new Error("Please define MONGO_URI in .env");

let cached = (global as any).mongoose;
if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToMongo() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
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