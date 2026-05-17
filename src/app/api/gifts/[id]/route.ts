import { NextRequest, NextResponse } from "next/server";
import { getGiftById } from "@/server/services/gift.service";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const gift = await getGiftById(params.id);
  if (!gift) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(gift);
}
