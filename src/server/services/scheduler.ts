import { getDb } from "@/lib/db";

/** Called by /api/cron — unlocks gifts whose unlock_at has passed */
export async function processUnlocks(): Promise<number> {
  const db = getDb();
  const { rows } = await db.query(
    `UPDATE gifts SET status='unlocked'
     WHERE status='locked' AND unlock_at <= NOW()
     RETURNING id`
  );
  return rows.length;
}
