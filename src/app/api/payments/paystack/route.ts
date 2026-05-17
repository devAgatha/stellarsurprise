import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { updateGiftStatus } from "@/server/services/gift.service";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hash = crypto.createHmac("sha512", process.env.PAYSTACK_SECRET_KEY!).update(body).digest("hex");
  if (hash !== req.headers.get("x-paystack-signature")) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const event = JSON.parse(body) as { event: string; data: { reference: string } };
  if (event.event === "charge.success") {
    const giftId = event.data.reference.split("_")[1];
    if (giftId) await updateGiftStatus(giftId, "locked");
  }
  return NextResponse.json({ received: true });
}
