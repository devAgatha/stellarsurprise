import { getDb } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import type { CreateGiftInput, Gift } from "@/types";

export async function createGift(senderId: string, input: CreateGiftInput): Promise<Gift> {
  const db = getDb();
  const id = uuidv4();
  const { rows } = await db.query(
    `INSERT INTO gifts (id, sender_id, recipient_phone, amount_usd, message, unlock_at, status)
     VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING *`,
    [id, senderId, input.recipientPhone, input.amountUsd, input.message ?? null, input.unlockAt]
  );
  return rowToGift(rows[0]);
}

export async function getGiftById(id: string): Promise<Gift | null> {
  const db = getDb();
  const { rows } = await db.query("SELECT * FROM gifts WHERE id=$1", [id]);
  return rows[0] ? rowToGift(rows[0]) : null;
}

export async function getGiftsBySender(senderId: string): Promise<Gift[]> {
  const db = getDb();
  const { rows } = await db.query(
    "SELECT * FROM gifts WHERE sender_id=$1 ORDER BY created_at DESC",
    [senderId]
  );
  return rows.map(rowToGift);
}

export async function updateGiftStatus(
  id: string,
  status: string,
  extra?: { stellarTxHash?: string; escrowContractId?: string }
): Promise<void> {
  const db = getDb();
  await db.query(
    `UPDATE gifts SET status=$2, stellar_tx_hash=COALESCE($3,stellar_tx_hash),
     escrow_contract_id=COALESCE($4,escrow_contract_id) WHERE id=$1`,
    [id, status, extra?.stellarTxHash ?? null, extra?.escrowContractId ?? null]
  );
}

function rowToGift(row: Record<string, unknown>): Gift {
  return {
    id: row.id as string,
    senderPhone: row.sender_phone as string,
    recipientPhone: row.recipient_phone as string,
    amountUsd: parseFloat(row.amount_usd as string),
    message: row.message as string | undefined,
    unlockAt: new Date(row.unlock_at as string),
    status: row.status as Gift["status"],
    stellarTxHash: row.stellar_tx_hash as string | undefined,
    escrowContractId: row.escrow_contract_id as string | undefined,
    createdAt: new Date(row.created_at as string),
    claimedAt: row.claimed_at ? new Date(row.claimed_at as string) : undefined,
  };
}
