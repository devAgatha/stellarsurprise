import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function requireAuth(req: NextRequest): { userId: string } | NextResponse {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET!) as { sub: string };
    return { userId: payload.sub };
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
