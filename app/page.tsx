"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Tool = {
  name: string;
  desc: string;
  icon: "synergy" | "calc" | "tier" | "heroes" | "glossary";
  href: string;
};

type Game = {
  slug: string;
  name: string;
  tag: string;
  desc: string;
  bg: string;
  card: string;
  logo?: string;
  accent: string;
  tools: Tool[];
  badge: string;
  badgeColor: string;
};

const DOTS = Array.from({ length: 38 }, (_, i) => ({
  id:       i,
  left:     `${((i * 37 + 11) % 97) + 1}%`,
  top:      `${((i * 53 + 7)  % 97) + 1}%`,
  size:     (i % 3 === 0 ? 2 : i % 3 === 1 ? 1.5 : 1),
  delay:    `${((i * 0.41) % 6).toFixed(2)}s`,
  duration: `${4 + (i % 6)}s`,
  opacity:  +(0.08 + (i % 7) * 0.03).toFixed(2),
}));

function ParticleDots() {
  return (
    <>
      {DOTS.map(d => (
        <div
          key={d.id}
          style={{
            position: "absolute",
            left: d.left, top: d.top,
            width: d.size, height: d.size,
            borderRadius: "50%",
            background: "#f59e0b",
            opacity: d.opacity,
            animation: `floatDot ${d.duration} ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
    </>
  );
}

const GAMES: Game[] = [
  {
    slug:   "the-bazaar",
    name:   "The Bazaar",
    tag:    "Roguelite · Auto-battler",
    desc:   "Synergy explorer, damage calculators, hero builds, and the only complete Karnok guide online.",
    bg:     "/images/backgrounds/alleyway.jpg",
    card:   "/images/heroes/jules-hq.jpg",
    logo:   undefined,
    accent: "#ec4899",
    tools: [
      { name: "Synergy",     desc: "Item combos & chains", icon: "synergy",  href: "/the-bazaar/synergy"     },
      { name: "Calculators", desc: "Burst & DPS math",     icon: "calc",     href: "/the-bazaar/calculators" },
      { name: "Tier List",   desc: "S14 rankings",         icon: "tier",     href: "/the-bazaar/tier-list"   },
      { name: "Heroes",      desc: "All 7 guides",         icon: "heroes",   href: "/the-bazaar/heroes"      },
      { name: "Glossary",    desc: "Terms & effects",      icon: "glossary", href: "/the-bazaar/glossary"    },
    ],
    badge:      "Season 14 · Live",
    badgeColor: "#10b981",
  },
];

function ToolIcon({ icon, accent }: { icon: Tool["icon"]; accent: string }) {
  switch (icon) {
    case "synergy":
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="4"  r="2.5" fill={accent} />
          <circle cx="3" cy="14" r="2"   fill={accent} opacity="0.6" />
          <circle cx="15" cy="14" r="2"  fill={accent} opacity="0.6" />
          <line x1="9" y1="6.5" x2="3"  y2="12" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
          <line x1="9" y1="6.5" x2="15" y2="12" stroke={accent} strokeWidth="1" strokeOpacity="0.4" />
          <line x1="5" y1="14"  x2="13" y2="14"  stroke={accent} strokeWidth="1" strokeOpacity="0.3" />
        </svg>
      );
    case "calc":
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <rect x="1"  y="11" width="4" height="6" rx="1" fill={accent} opacity="0.35" />
          <rect x="7"  y="6"  width="4" height="11" rx="1" fill={accent} opacity="0.65" />
          <rect x="13" y="2"  width="4" height="15" rx="1" fill={accent} />
        </svg>
      );
    case "tier":
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <rect x="1" y="1"    width="16" height="5"   rx="1.5" fill={accent} />
          <rect x="1" y="7.5"  width="16" height="3.5" rx="1.5" fill={accent} opacity="0.55" />
          <rect x="1" y="12.5" width="16" height="3.5" rx="1.5" fill={accent} opacity="0.25" />
        </svg>
      );
    case "heroes":
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <circle cx="9" cy="6" r="3.5" fill={accent} opacity="0.85" />
          <path d="M2 17c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke={accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
        </svg>
      );
    case "glossary":
      return (
        <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
          <rect x="2" y="4"  width="10" height="1.5" rx="0.75" fill={accent} />
          <rect x="2" y="8"  width="14" height="1.5" rx="0.75" fill={accent} opacity="0.65" />
          <rect x="2" y="12" width="11" height="1.5" rx="0.75" fill={accent} opacity="0.4" />
        </svg>
      );
  }
}

function MiniToolCard({ tool, accent }: { tool: Tool; accent: string }) {
  const [hov, setHov] = useState(false);
  const router = useRouter();

  return (
    <div
      role="link"
      tabIndex={0}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(tool.href); }}
      onKeyDown={(e) => { if (e.key === "Enter") { e.stopPropagation(); router.push(tool.href); } }}
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        flexDirection: "column",
        gap: 5,
        padding: "9px 10px 10px",
        borderRadius: 10,
        background: hov ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.4)",
        border: `1px solid ${hov ? accent + "50" : "rgba(255,255,255,0.08)"}`,
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        transition: "background 0.15s, border-color 0.15s, transform 0.15s",
        transform: hov ? "translateY(-2px)" : "none",
        cursor: "pointer",
      }}
    >
      <ToolIcon icon={tool.icon} accent={accent} />
      <div style={{ fontSize: 10, fontWeight: 700, color: "#d1d5db", letterSpacing: 0.2, lineHeight: 1.2, marginTop: 1 }}>
        {tool.name}
      </div>
      <div style={{ fontSize: 9, color: "#4b5563", lineHeight: 1.3 }}>
        {tool.desc}
      </div>
    </div>
  );
}

function GameCard({ game }: { game: Game }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/${game.slug}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        height: 460,
        border: `1px solid ${hovered ? game.accent + "60" : "rgba(255,255,255,0.07)"}`,
        boxShadow: hovered
          ? `0 0 60px ${game.accent}20, 0 24px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)`
          : "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
        transition: "border-color 0.25s, box-shadow 0.3s, transform 0.2s",
        transform: hovered ? "translateY(-8px)" : "none",
        cursor: "pointer",
        background: "#09091a",
      }}
    >
      {/* Background scene */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.bg}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          objectFit: "cover", objectPosition: "center 30%",
          zIndex: 0,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
          transform: hovered ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Dark overlays */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1,
        background: `
          linear-gradient(to top, rgba(9,9,26,1) 0%, rgba(9,9,26,0.7) 45%, rgba(9,9,26,0.15) 100%),
          linear-gradient(to right, rgba(9,9,26,0.55) 0%, transparent 60%)
        `,
      }} />

      {/* Accent glow on hover */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none",
        background: `radial-gradient(ellipse at 65% 20%, ${game.accent}${hovered ? "18" : "07"} 0%, transparent 65%)`,
        transition: "background 0.4s",
      }} />

      {/* Character art */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={game.card}
        alt=""
        aria-hidden="true"
        style={{
          position: "absolute",
          right: "6%", bottom: 0,
          height: "72%", width: "auto",
          objectFit: "contain", objectPosition: "bottom center",
          zIndex: 2,
          transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), filter 0.3s",
          transform: hovered ? "translateY(-8px) scale(1.04)" : "none",
          filter: hovered
            ? `drop-shadow(0 0 32px ${game.accent}55)`
            : `drop-shadow(0 0 12px ${game.accent}25)`,
        }}
      />

      {/* Content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 24px 24px", zIndex: 3 }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase",
            color: game.badgeColor,
            background: `${game.badgeColor}14`,
            border: `1px solid ${game.badgeColor}30`,
            padding: "4px 10px", borderRadius: 4,
          }}>
            {game.badge}
          </span>
        </div>
        <div style={{ fontSize: 10, fontWeight: 600, color: "#374151", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 6 }}>
          {game.tag}
        </div>
        {game.logo ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src={game.logo} alt={game.name} style={{ height: 48, width: "auto", objectFit: "contain", marginBottom: 8, filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.7))" }} />
        ) : (
          <div style={{
            fontFamily: "'TheBazaar', serif",
            fontSize: 46,
            color: "#f5c842",
            letterSpacing: "1px",
            marginBottom: 8,
            lineHeight: 1,
            textShadow: "0 0 28px rgba(245,158,11,0.5), 0 2px 10px rgba(0,0,0,0.9)",
          }}>
            {game.name}
          </div>
        )}
        <div style={{ fontSize: 12, color: "#4b5563", lineHeight: 1.65, marginBottom: 14, maxWidth: 300 }}>
          {game.desc}
        </div>

        {/* Mini tool cards */}
        <div style={{ display: "flex", gap: 6 }}>
          {game.tools.map(t => (
            <MiniToolCard key={t.name} tool={t} accent={game.accent} />
          ))}
        </div>
      </div>

      {/* Hover CTA */}
      <div style={{
        position: "absolute", top: 18, right: 18, zIndex: 4,
        opacity: hovered ? 1 : 0,
        transform: hovered ? "translateY(0)" : "translateY(-4px)",
        transition: "opacity 0.2s, transform 0.2s",
        background: "rgba(9,9,26,0.88)",
        border: `1px solid ${game.accent}45`,
        backdropFilter: "blur(8px)",
        padding: "7px 16px", borderRadius: 8,
        fontSize: 12, fontWeight: 700, color: "#e2e4f0",
        pointerEvents: "none",
      }}>
        Open Toolkit →
      </div>
    </div>
  );
}

function ComingSoonCard() {
  return (
    <div style={{
      position: "relative",
      borderRadius: 20,
      overflow: "hidden",
      height: 460,
      border: "1px solid rgba(255,255,255,0.04)",
      background: "#070818",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }} />
      <div style={{ position: "relative", textAlign: "center", padding: 32 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          border: "1px solid rgba(255,255,255,0.07)",
          margin: "0 auto 20px",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 28, color: "#1e2030",
        }}>
          +
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: "#252638", marginBottom: 8 }}>
          Next Game
        </div>
        <div style={{ fontSize: 12, color: "#1a1c2a", lineHeight: 1.65 }}>
          New tools added as<br />games are researched
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div style={{ background: "var(--bg-base)", minHeight: "100vh", position: "relative" }}>

      {/* Fixed amber particle layer — behind all content */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
        <ParticleDots />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div style={{
        width: "100vw", position: "relative", left: "50%", transform: "translateX(-50%)",
        overflow: "hidden", paddingTop: 72, paddingBottom: 56, textAlign: "center",
      }}>
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `
            radial-gradient(ellipse at 30% 60%, rgba(245,158,11,0.06) 0%, transparent 50%),
            radial-gradient(ellipse at 72% 30%, rgba(236,72,153,0.04) 0%, transparent 46%),
            radial-gradient(ellipse at 50% 110%, rgba(139,92,246,0.05) 0%, transparent 50%)
          `,
        }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "0 24px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase",
            color: "#f59e0b", background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.2)", padding: "6px 16px", borderRadius: 20, marginBottom: 28,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#f59e0b", animation: "dotPulse 2s ease-in-out infinite", display: "inline-block" }} />
            Interactive Game Tools
          </div>

          <h1 style={{ fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-3px", margin: "0 0 4px", color: "#e2e4f0" }}>
            Meta
          </h1>
          <div className="text-shimmer" style={{ fontSize: "clamp(44px, 6vw, 72px)", fontWeight: 900, lineHeight: 0.93, letterSpacing: "-3px", display: "block", marginBottom: 24 }}>
            Grind
          </div>

          <div style={{ width: 48, height: 2, background: "linear-gradient(to right, transparent, #f59e0b, transparent)", margin: "0 auto 22px" }} />

          <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.75, margin: 0, maxWidth: 520 }}>
            Deep interactive tools for games that deserve them. Synergy explorers, damage calculators, tier lists, and hero guides — built for players, not browsers.
          </p>
        </div>
      </div>

      {/* ── GAME DIRECTORY ──────────────────────────────────── */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#f59e0b", whiteSpace: "nowrap" }}>
            Games
          </div>
          <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, rgba(245,158,11,0.25), transparent)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {GAMES.map(game => <GameCard key={game.slug} game={game} />)}
          <ComingSoonCard />
        </div>
      </div>
      </div>{/* end z-index:1 wrapper */}
    </div>
  );
}
