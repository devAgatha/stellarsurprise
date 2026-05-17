import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/server/middleware/auth";
import { claimGift } from "@/server/services/claim.service";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const auth = requireAuth(req);
  if (auth instanceof NextResponse) return auth;
  const { stellarAddress } = await req.json() as { stellarAddress: string };
  if (!stellarAddress) return NextResponse.json({ error: "stellarAddress required" }, { status: 400 });
  const txHash = await claimGift(params.id, stellarAddress);
  return NextResponse.json({ txHash });
}
