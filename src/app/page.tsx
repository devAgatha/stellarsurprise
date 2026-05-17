import Link from "next/link";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <div style={{ textAlign: "center", color: "white", maxWidth: "600px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1rem" }}>StellarSurprise 🎁</h1>
        <p style={{ fontSize: "1.25rem", marginBottom: "0.5rem", opacity: 0.9 }}>
          Time-locked cash gifts on the Stellar blockchain.
        </p>
        <p style={{ fontSize: "1rem", marginBottom: "2rem", opacity: 0.75 }}>
          Send money that stays completely hidden until a surprise unlock date.
        </p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
          <Link href="/send" style={{ background: "white", color: "#764ba2", padding: "0.75rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none" }}>
            Send a Gift
          </Link>
          <Link href="/dashboard" style={{ border: "2px solid white", color: "white", padding: "0.75rem 2rem", borderRadius: "0.5rem", fontWeight: 700, textDecoration: "none" }}>
            My Gifts
          </Link>
        </div>
      </div>
    </main>
  );
}
