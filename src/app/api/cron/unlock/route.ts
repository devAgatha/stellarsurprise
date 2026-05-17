import { NextRequest, NextResponse } from "next/server";
import { processUnlocks } from "@/server/services/scheduler";

export async function POST(req: NextRequest) {
  if (req.headers.get("x-cron-secret") !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const count = await processUnlocks();
  return NextResponse.json({ unlocked: count });
}
