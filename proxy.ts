// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env.local");
}

// Ye routes protected hain
const protectedPaths = [ "/dashboard", "/profile", "/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Agar koi protected route pe ja raha hai
  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtectedRoute) {
    return NextResponse.next(); // Public routes allow karo
  }

  // Token check karo
  const token = request.cookies.get("accessToken")?.value;

  if (!token) {
    console.log("No token → redirect to login");
    return redirectToLogin(request);
  }

  try {
    // Token verify karo
    jwt.verify(token, JWT_SECRET!);
    // Token valid hai → allow
    return NextResponse.next();
  } catch (error) {
    console.log("Invalid/expired token → redirect to login");
    return redirectToLogin(request);
  }
}

// Helper: Login page pe redirect + current URL save karo (return back ke liye)
function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL("/home/authPage", request.url); // ya /login
  loginUrl.searchParams.set("redirect", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

// Matcher — sirf in routes pe middleware chalega
export const config = {
  matcher: [
    "/home/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
  ],
};