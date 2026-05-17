"use client";
import { useEffect, useState } from "react";
import type { Gift } from "@/types";

export default function DashboardPage() {
  const [gifts, setGifts] = useState<Gift[]>([]);

  useEffect(() => {
    fetch("/api/gifts").then(r => r.json()).then(setGifts).catch(() => {});
  }, []);

  const statusColor: Record<string, string> = {
    pending: "#f59e0b", funded: "#3b82f6", locked: "#8b5cf6",
    unlocked: "#10b981", claimed: "#6b7280", expired: "#ef4444",
  };

  return (
    <main style={{ maxWidth: "800px", margin: "2rem auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "2rem" }}>My Gifts 🎁</h1>
      {gifts.length === 0 ? (
        <p style={{ color: "#64748b" }}>No gifts yet. <a href="/send" style={{ color: "#764ba2" }}>Send one!</a></p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {gifts.map(g => (
            <div key={g.id} style={{ background: "white", borderRadius: "0.75rem", padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ fontWeight: 600 }}>To: {g.recipientPhone}</p>
                  <p style={{ color: "#64748b", fontSize: "0.875rem" }}>${g.amountUsd} USDC · Unlocks {new Date(g.unlockAt).toLocaleString()}</p>
                  {g.message && <p style={{ color: "#64748b", fontSize: "0.875rem", marginTop: "0.25rem" }}>"{g.message}"</p>}
                </div>
                <span style={{ background: statusColor[g.status] ?? "#6b7280", color: "white", padding: "0.25rem 0.75rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600 }}>
                  {g.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
