import {  NextResponse } from "next/server";
export async function POST() {
  const res = new NextResponse(JSON.stringify({ success: true }), { status: 200 });
  res.cookies.set('accessToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    expires: new Date(0), // instantly expire
  });
  return res;
}
