import type { Metadata } from "next";
import { Outfit, Oxanium } from "next/font/google";
import Link from "next/link";
import { GameLink } from "./components/GameLink";
import DotBackground from "./components/ui/dot-background";
import ThemeToggle from "./components/ThemeToggle";
import "./globals.css";

// Outfit — clean geometric workhorse for body + dense tool UI
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

// Oxanium — esports-tech display face for wordmarks & big headings
const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MetaGrind — Interactive Tools for Hardcore Gamers",
  description:
    "MetaGrind builds interactive tools for games that deserve better resources. Item synergy explorers, damage calculators, tier lists, and deep-dive guides.",
  keywords: "game tools, tier list, build guide, synergy explorer, The Bazaar, interactive calculator",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${oxanium.variable}`}>
      <head>
        {/* Apply saved theme before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('theme');document.documentElement.classList.toggle('dark',t!=='light');}catch(e){document.documentElement.classList.add('dark');}` }} />
      </head>
      <body>
        <DotBackground />

        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>

          {/* ── TOP NAV ─────────────────────────────────────── */}
          <header style={{
            position: "sticky",
            top: 0,
            zIndex: 50,
            background: "rgba(5,6,12,0.92)",
            backdropFilter: "blur(14px)",
            WebkitBackdropFilter: "blur(14px)",
            borderBottom: "1px solid rgba(255,255,255,0.04)",
          }}>
            <div style={{
              maxWidth: 1280,
              margin: "0 auto",
              padding: "0 32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: 54,
            }}>
              {/* Brand */}
              <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  flexShrink: 0,
                }}>
                  ⚡
                </div>
                <span className="mg-display" style={{ fontSize: 17, fontWeight: 800, letterSpacing: "0.5px" }}>
                  <span style={{ color: "#e2e4f0" }}>Meta</span>
                  <span style={{ color: "#f59e0b" }}>Grind</span>
                </span>
              </Link>

              {/* Game links + theme toggle */}
              <nav style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <GameLink href="/the-bazaar" label="The Bazaar" />
                <div style={{
                  marginLeft: 8,
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#374151",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "4px 9px",
                  borderRadius: 4,
                  whiteSpace: "nowrap",
                }}>
                  + More Coming
                </div>
                <div style={{ marginLeft: 8 }}>
                  <ThemeToggle />
                </div>
              </nav>
            </div>
          </header>

          <main style={{ flex: 1 }}>
            {children}
          </main>

          <footer style={{
            borderTop: "1px solid rgba(255,255,255,0.04)",
            padding: "24px 32px",
            textAlign: "center",
            color: "#2a2c38",
            fontSize: 12,
          }}>
            <div style={{ maxWidth: 1280, margin: "0 auto" }}>
              MetaGrind &nbsp;·&nbsp; Community tools — not affiliated with any game publisher
            </div>
          </footer>

        </div>
      </body>
    </html>
  );
}
