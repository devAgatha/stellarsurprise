"use client";
import { useState } from "react";

export default function SendGiftPage() {
  const [form, setForm] = useState({ recipientPhone: "", amountUsd: "", message: "", unlockAt: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/gifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amountUsd: parseFloat(form.amountUsd) }),
      });
      if (res.ok) setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🎉 Gift Created!</h2>
      <p>Your surprise gift has been locked on the Stellar blockchain.</p>
    </div>
  );

  return (
    <main style={{ maxWidth: "480px", margin: "4rem auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.75rem", fontWeight: 700, marginBottom: "2rem" }}>Send a Surprise Gift 🎁</h1>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <label>
          <span style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Recipient Phone</span>
          <input type="tel" required value={form.recipientPhone}
            onChange={e => setForm({ ...form, recipientPhone: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}
            placeholder="+1234567890" />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Amount (USD)</span>
          <input type="number" required min="1" value={form.amountUsd}
            onChange={e => setForm({ ...form, amountUsd: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }}
            placeholder="50" />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Unlock Date & Time</span>
          <input type="datetime-local" required value={form.unlockAt}
            onChange={e => setForm({ ...form, unlockAt: new Date(e.target.value).toISOString() })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem" }} />
        </label>
        <label>
          <span style={{ display: "block", marginBottom: "0.25rem", fontWeight: 600 }}>Message (optional)</span>
          <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            style={{ width: "100%", padding: "0.75rem", border: "1px solid #e2e8f0", borderRadius: "0.5rem", minHeight: "80px" }}
            placeholder="Happy Birthday! 🎂" />
        </label>
        <button type="submit" disabled={loading}
          style={{ background: "#764ba2", color: "white", padding: "0.875rem", borderRadius: "0.5rem", fontWeight: 700, border: "none", cursor: "pointer", opacity: loading ? 0.6 : 1 }}>
          {loading ? "Creating..." : "Lock Gift on Stellar 🔒"}
        </button>
      </form>
    </main>
  );
}
