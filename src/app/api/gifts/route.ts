import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/middleware/auth";
import { createGift, getGiftsBySender } from "@/server/services/gift.service";
import { CreateGiftSchema } from "@/types";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const gifts = await getGiftsBySender(auth.userId);
  return NextResponse.json(gifts);
}

export async function POST(req: NextRequest) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const body = await req.json();
  const parsed = CreateGiftSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const gift = await createGift(auth.userId, parsed.data);
  return NextResponse.json(gift, { status: 201 });
}
