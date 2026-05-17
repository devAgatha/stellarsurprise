import { getDb } from "@/lib/db";
import { getGiftById, updateGiftStatus } from "./gift.service";
import { sendUsdc } from "@/lib/stellar";

export async function claimGift(giftId: string, recipientStellarAddress: string): Promise<string> {
  const gift = await getGiftById(giftId);
  if (!gift) throw new Error("Gift not found");
  if (gift.status !== "unlocked") throw new Error("Gift is not yet unlocked");

  const txHash = await sendUsdc(
    process.env.ESCROW_ADMIN_SECRET!,
    recipientStellarAddress,
    gift.amountUsd.toFixed(7)
  );

  await updateGiftStatus(giftId, "claimed", { stellarTxHash: txHash });

  const db = getDb();
  await db.query("UPDATE gifts SET claimed_at=NOW() WHERE id=$1", [giftId]);

  return txHash;
}
