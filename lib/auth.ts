// lib/auth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "./modals/Users";
import { cookies } from "next/headers";
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Get current logged-in user from JWT cookie
 * Use in API routes: const user = await getCurrentUser(req);
 */
export async function getCurrentUser(req?: NextRequest) {
  try {
      let token: string | undefined;
       token = (await cookies()).get('accessToken')?.value;


    // 1. From API route (NextRequest)
    if (req) {
      const authHeader = req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    // 2. From cookies (fallback for server components or client-side fetch)
    if (!token && typeof window === "undefined") {
      // Server-side: read from cookies
      const cookieHeader = req?.headers.get("cookie");
      if (cookieHeader) {
        const match = cookieHeader.match(/accessToken=([^;]+)/);
        token = match?.[1];
      }
    }

    if (!token) return null;

    // 3. Verify JWT
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    if (!payload.userId) return null;

    // 4. Fetch user from DB
    const user = await User.findById(payload.userId).select("-passwordHash");
    return user ? user.toObject() : null;

  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}