import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StellarSurprise 🎁",
  description: "Time-locked cash gifts on the Stellar blockchain",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
