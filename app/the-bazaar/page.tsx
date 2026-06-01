"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import heroes from "@/public/data/heroes.json";

const HERO_SPLASH: Record<string, string> = {
  vanessa:   "/images/heroes/vanessa-hq.jpg",
  pygmalien: "/images/heroes/pygmalien-hq.jpg",
  dooley:    "/images/heroes/dooley-hq.jpg",
  mak:       "/images/heroes/mak-hq.jpg",
  stelle:    "/images/heroes/stelle-hq.jpg",
  jules:     "/images/heroes/jules-hq.jpg",
  karnok:    "/images/heroes/karnok-hq.png",
};

const HERO_COLORS: Record<string, string> = {
  vanessa:   "#3b82f6",
  pygmalien: "#f59e0b",
  dooley:    "#06b6d4",
  mak:       "#10b981",
  stelle:    "#f97316",
  jules:     "#ec4899",
  karnok:    "#dc2626",
};

const TOOLS = [
  { href: "/the-bazaar/calculators", title: "Damage Calculators", desc: "Burn decay, Poison DPS vs. regen, Max HP scaling for Anchor/Runic/Skyscraper, and Durian conversion.", badge: "4 Formulas", color: "#3b82f6" },
  { href: "/the-bazaar/tier-list",   title: "Season 14 Tier List", desc: "Full meta rankings with the complete S14 buff/nerf log and all 19 new neutral items.", badge: "S14 Current", color: "#10b981" },
  { href: "/the-bazaar/heroes",      title: "Hero Comparison",    desc: "All 7 heroes side by side — difficulty, damage type, DLC cost, and unique mechanic.", badge: "All 7", color: "#8b5cf6" },
  { href: "/the-bazaar/heroes/karnok", title: "Karnok Deep Dive", desc: "Newest DLC hero (March 2026) — complete Rage system, Jacket Exodia, and the Sled + Mask secret.", badge: "First Mover", color: "#dc2626" },
  { href: "/the-bazaar/glossary",    title: "Keyword Glossary",  desc: "Every keyword with edge cases that cost fights. Lifesteal ≠ Healing. Fully searchable.", badge: "14 Keywords", color: "#6366f1" },
];

// Deterministic particles — stable between renders
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: ((i * 17 + 7) % 93) + 2,
  delay: ((i * 0.43) % 9).toFixed(2),
  duration: (6 + ((i * 0.77) % 8)).toFixed(1),
  size: (1 + ((i * 0.41) % 2.4)).toFixed(1),
  dx: (((i % 2 === 0 ? 1 : -1) * ((i * 11 + 3) % 50))).toFixed(0),
}));

function Particles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 2 }}>
      {PARTICLES.map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.left}%`,
            bottom: "-4px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: "50%",
            background: "rgba(245,158,11,0.85)",
            boxShadow: "0 0 8px rgba(245,158,11,0.5)",
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in infinite`,
            ["--particle-dx" as string]: `${p.dx}px`,
          }}
        />
      ))}
    </div>
  );
}

function HeroCard({ hero, delay = 0 }: { hero: typeof heroes[number]; delay?: number }) {
  const [hovered, setHovered] = useState(false);
  const color = HERO_COLORS[hero.id] ?? "#f59e0b";
  const img = HERO_SPLASH[hero.id];

  return (
    <Link href={`/the-bazaar/heroes/${hero.id}`} style={{ textDecoration: "none", display: "block" }}
      className={`reveal reveal-d${Math.min(Math.ceil((delay / 0.08) + 1), 7)}`}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: 14,
          overflow: "hidden",
          height: 320,
          border: `1px solid ${hovered ? color + "70" : "#1e2236"}`,
          boxShadow: hovered
            ? `0 0 40px ${color}25, 0 8px 32px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.04)`
            : "0 4px 16px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.02)",
          transition: "border-color 0.2s, box-shadow 0.25s, transform 0.18s",
          transform: hovered ? "translateY(-6px) scale(1.01)" : "none",
          cursor: "pointer",
          background: "#0b0c15",
        }}
      >
        {/* Portrait art */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img}
          alt={hero.name}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: hero.id === "karnok" ? "center 20%" : "top center",
            transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
            transform: hovered ? "scale(1.06)" : "scale(1)",
          }}
        />

        {/* Base gradient: dark at bottom, barely at top */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to bottom,
            rgba(7,8,15,0.04) 0%,
            rgba(7,8,15,0.1)  38%,
            rgba(7,8,15,0.78) 68%,
            rgba(7,8,15,0.98) 100%
          )`,
        }} />

        {/* Hero-color radial glow from top on hover */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 0%, ${color}${hovered ? "20" : "08"} 0%, transparent 65%)`,
          transition: "background 0.3s",
          pointerEvents: "none",
        }} />

        {/* Top badges */}
        <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: hero.difficulty === "Beginner" ? "#22c55e" : hero.difficulty === "Intermediate" ? "#f59e0b" : "#ef4444",
            background: "rgba(7,8,15,0.85)",
            border: `1px solid ${hero.difficulty === "Beginner" ? "#22c55e" : hero.difficulty === "Intermediate" ? "#f59e0b" : "#ef4444"}40`,
            padding: "3px 8px",
            borderRadius: 4,
            backdropFilter: "blur(8px)",
          }}>
            {hero.difficulty}
          </span>
          {hero.dlc && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#f59e0b",
              background: "rgba(7,8,15,0.85)",
              border: "1px solid rgba(245,158,11,0.35)",
              padding: "3px 8px",
              borderRadius: 4,
              backdropFilter: "blur(8px)",
            }}>
              DLC · ${hero.price}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "18px 18px 20px" }}>
          <div style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: color,
            marginBottom: 6,
          }}>
            {hero.archetype[0]}
          </div>
          <div style={{ fontSize: 19, fontWeight: 900, color: "#e2e4f0", letterSpacing: "-0.5px", lineHeight: 1.05, marginBottom: 5 }}>
            {hero.name}
          </div>
          <div style={{ fontSize: 11, color: "#6b7280" }}>{hero.role}</div>
        </div>
      </div>
    </Link>
  );
}

function ToolCard({ tool }: { tool: typeof TOOLS[number] }) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link href={tool.href} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered ? "#111228" : "#0d0e1a",
          border: `1px solid ${hovered ? tool.color + "55" : "#1a1b2c"}`,
          borderRadius: 12,
          padding: "24px 26px",
          height: "100%",
          transition: "background 0.18s, border-color 0.18s, box-shadow 0.18s, transform 0.14s",
          boxShadow: hovered
            ? `0 0 28px ${tool.color}14, 0 8px 32px rgba(0,0,0,0.6)`
            : "0 2px 12px rgba(0,0,0,0.4)",
          transform: hovered ? "translateY(-3px)" : "none",
          cursor: "pointer",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Corner glow */}
        <div style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(ellipse, ${tool.color}${hovered ? "14" : "06"} 0%, transparent 70%)`,
          transition: "background 0.2s",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14, gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#dde0f0", lineHeight: 1.3 }}>{tool.title}</div>
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 0.5,
              textTransform: "uppercase",
              flexShrink: 0,
              background: `${tool.color}15`,
              color: tool.color,
              padding: "4px 9px",
              borderRadius: 4,
              border: `1px solid ${tool.color}30`,
            }}>
              {tool.badge}
            </span>
          </div>
          <div style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.7 }}>{tool.desc}</div>
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  // Scroll reveal via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "var(--bg-base)" }}>

      {/* ╔══════════════════════════════════════════╗ */}
      {/* ║  CINEMATIC HERO — full-bleed             ║ */}
      {/* ╚══════════════════════════════════════════╝ */}
      <div style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        marginTop: -32,
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}>
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/backgrounds/marketplace.jpg"
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 35%",
            zIndex: 0,
          }}
        />

        {/* Left darkness gradient — makes text readable */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(to right,
              rgba(7,8,15,0.97) 0%,
              rgba(7,8,15,0.82) 38%,
              rgba(7,8,15,0.50) 62%,
              rgba(7,8,15,0.22) 100%
            ),
            linear-gradient(to top,
              rgba(7,8,15,1) 0%,
              rgba(7,8,15,0.5) 25%,
              transparent 55%
            )
          `,
          zIndex: 1,
        }} />

        {/* Atmospheric vignette */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 38%, rgba(7,8,15,0.55) 100%)",
          zIndex: 1,
          pointerEvents: "none",
        }} />

        {/* Gold atmospheric light */}
        <div style={{
          position: "absolute",
          bottom: "8%",
          left: "30%",
          width: 800,
          height: 400,
          background: "radial-gradient(ellipse, rgba(245,158,11,0.07) 0%, transparent 70%)",
          zIndex: 1,
          pointerEvents: "none",
          filter: "blur(10px)",
        }} />

        {/* Particles */}
        <Particles />

        {/* Main content grid */}
        <div style={{
          position: "relative",
          zIndex: 3,
          width: "100%",
          maxWidth: 1280,
          margin: "0 auto",
          padding: "100px 48px 80px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 0,
          alignItems: "center",
          minHeight: "90vh",
        }}>
          {/* LEFT — Text */}
          <div style={{ paddingRight: 40 }}>
            {/* Live dot + season badge */}
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: "#f59e0b",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.25)",
              padding: "6px 16px",
              borderRadius: 20,
              marginBottom: 30,
            }}>
              <span style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#f59e0b",
                animation: "dotPulse 2s ease-in-out infinite",
                display: "inline-block",
              }} />
              Season 14 · Monster Mayhem
            </div>

            <h1 style={{
              fontSize: "clamp(50px, 6.5vw, 82px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-3.5px",
              color: "#e2e4f0",
              margin: "0 0 4px",
              textShadow: "0 4px 60px rgba(0,0,0,0.9)",
            }}>
              The Bazaar
            </h1>
            <div className="text-shimmer" style={{
              fontSize: "clamp(50px, 6.5vw, 82px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-3.5px",
              display: "block",
              marginBottom: 30,
            }}>
              Toolkit
            </div>

            {/* Divider line */}
            <div style={{
              width: 60,
              height: 2,
              background: "linear-gradient(to right, #f59e0b, transparent)",
              marginBottom: 24,
              borderRadius: 1,
            }} />

            <p style={{
              fontSize: 16,
              color: "#8b92a8",
              maxWidth: 420,
              margin: "0 0 38px",
              lineHeight: 1.75,
            }}>
              Interactive tools for hardcore players. Item synergy explorer, damage calculators, and the only complete Karnok guide online.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
              <Link href="/the-bazaar/synergy" style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                color: "#000",
                padding: "15px 34px",
                borderRadius: 9,
                fontWeight: 800,
                fontSize: 14,
                textDecoration: "none",
                letterSpacing: "-0.2px",
                boxShadow: "0 4px 28px rgba(245,158,11,0.35), 0 1px 0 rgba(255,255,255,0.15) inset",
              }}>
                Synergy Explorer →
              </Link>
              <Link href="/the-bazaar/heroes" style={{
                background: "rgba(255,255,255,0.06)",
                color: "#c5c9dc",
                padding: "15px 28px",
                borderRadius: 9,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(10px)",
              }}>
                Browse Heroes
              </Link>
            </div>

            {/* Quick stats row */}
            <div style={{
              display: "flex",
              gap: 28,
              marginTop: 44,
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.06)",
            }}>
              {[
                { val: "7", label: "Heroes" },
                { val: "6+", label: "Tools" },
                { val: "S14", label: "Season" },
                { val: "0", label: "Competing sites" },
              ].map(s => (
                <div key={s.label}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: "#e2e4f0", letterSpacing: "-1px" }}>{s.val}</div>
                  <div style={{ fontSize: 10, color: "#4b5563", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Hero card showcase */}
          <div style={{
            position: "relative",
            height: 520,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}>
            {/* Floor glow */}
            <div style={{
              position: "absolute",
              bottom: "2%",
              left: "50%",
              transform: "translateX(-50%)",
              width: 420,
              height: 80,
              background: "radial-gradient(ellipse, rgba(245,158,11,0.18) 0%, transparent 70%)",
              filter: "blur(25px)",
              zIndex: 0,
              pointerEvents: "none",
            }} />

            {/* Back card — Stelle */}
            <div style={{
              position: "absolute",
              left: "5%",
              bottom: "5%",
              width: 220,
              height: 340,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${HERO_COLORS.stelle}40`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 30px ${HERO_COLORS.stelle}20`,
              transform: "rotate(-6deg) translateY(20px)",
              zIndex: 1,
              opacity: 0.8,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/heroes/stelle-hq.jpg" alt="Stelle" style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
                filter: "brightness(0.75)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, rgba(7,8,15,0.05) 0%, rgba(7,8,15,0.85) 100%)`,
              }} />
              <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: HERO_COLORS.stelle, textTransform: "uppercase", marginBottom: 3 }}>Fighter</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#e2e4f0" }}>Stelle</div>
              </div>
            </div>

            {/* Front card — Jules */}
            <div style={{
              position: "absolute",
              left: "50%",
              bottom: "8%",
              width: 250,
              height: 400,
              borderRadius: 18,
              overflow: "hidden",
              border: `1px solid ${HERO_COLORS.jules}55`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.85), 0 0 50px ${HERO_COLORS.jules}30, inset 0 1px 0 rgba(255,255,255,0.06)`,
              transform: "translateX(-50%) rotate(2deg)",
              zIndex: 3,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/heroes/jules-hq.jpg" alt="Jules" style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, rgba(7,8,15,0.0) 0%, rgba(7,8,15,0.03) 40%, rgba(7,8,15,0.75) 75%, rgba(7,8,15,0.97) 100%)`,
              }} />
              {/* Jules hero color atmospheric top glow */}
              <div style={{
                position: "absolute", inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${HERO_COLORS.jules}25 0%, transparent 60%)`,
                pointerEvents: "none",
              }} />
              <div style={{ position: "absolute", bottom: 18, left: 18, right: 18 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2.5, color: HERO_COLORS.jules, textTransform: "uppercase", marginBottom: 4 }}>Trickster</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: "#e2e4f0", letterSpacing: "-0.3px" }}>Jules</div>
                <div style={{ fontSize: 10, color: "#6b7280", marginTop: 2 }}>Buff & Disable</div>
              </div>
            </div>

            {/* Back card — Mak */}
            <div style={{
              position: "absolute",
              right: "3%",
              bottom: "8%",
              width: 210,
              height: 320,
              borderRadius: 16,
              overflow: "hidden",
              border: `1px solid ${HERO_COLORS.mak}40`,
              boxShadow: `0 20px 60px rgba(0,0,0,0.8), 0 0 30px ${HERO_COLORS.mak}20`,
              transform: "rotate(5deg) translateY(10px)",
              zIndex: 2,
              opacity: 0.82,
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/heroes/mak-hq.jpg" alt="Mak" style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center",
                filter: "brightness(0.8)",
              }} />
              <div style={{
                position: "absolute", inset: 0,
                background: `linear-gradient(to bottom, rgba(7,8,15,0.05) 0%, rgba(7,8,15,0.85) 100%)`,
              }} />
              <div style={{ position: "absolute", bottom: 16, left: 16 }}>
                <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: 2, color: HERO_COLORS.mak, textTransform: "uppercase", marginBottom: 3 }}>Tank</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#e2e4f0" }}>Mak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom blend into page */}
        <div style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background: "linear-gradient(to top, #07080f 0%, transparent 100%)",
          zIndex: 4,
          pointerEvents: "none",
        }} />

        {/* Scroll cue */}
        <div style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 5,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: 0.4,
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: 9, letterSpacing: 3, textTransform: "uppercase", color: "#6b7280" }}>Scroll</div>
          <div style={{ width: 1, height: 28, background: "linear-gradient(to bottom, #6b7280, transparent)" }} />
        </div>
      </div>

      {/* ── PAGE CONTENT ─────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── HERO ROSTER ─────────────────────────────────── */}
        <div style={{ paddingTop: 72, paddingBottom: 64 }}>
          <div className="reveal" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 10 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#f59e0b", whiteSpace: "nowrap" }}>
              Choose Your Champion
            </div>
            <div style={{ height: 1, flex: 1, background: "linear-gradient(to right, rgba(245,158,11,0.25), transparent)" }} />
          </div>
          <div className="reveal" style={{ fontSize: 28, fontWeight: 900, color: "#e2e4f0", marginBottom: 36, letterSpacing: "-0.8px" }}>
            All 7 Heroes
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 18 }}>
            {heroes.map((h, i) => (
              <HeroCard key={h.id} hero={h} delay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* ── SECTION DIVIDER ─────────────────────────────── */}
        <div style={{
          height: 1,
          background: "linear-gradient(to right, transparent, rgba(30,34,54,0.8) 20%, rgba(30,34,54,0.8) 80%, transparent)",
          marginBottom: 64,
        }} />

        {/* ── FEATURED TOOL — Synergy Explorer ────────────── */}
        <div className="reveal" style={{ marginBottom: 16 }}>
          <Link href="/the-bazaar/synergy" style={{ textDecoration: "none", display: "block" }}>
            <div className="glow-border" style={{
              background: "linear-gradient(135deg, #0c0d1a 0%, #10112a 50%, #0c0d1a 100%)",
              border: "1px solid rgba(245,158,11,0.3)",
              borderRadius: 18,
              padding: "36px 40px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Large atmospheric glow top-right */}
              <div style={{
                position: "absolute",
                top: -60,
                right: -60,
                width: 320,
                height: 320,
                borderRadius: "50%",
                background: "radial-gradient(ellipse, rgba(245,158,11,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }} />
              {/* Diagonal light streak */}
              <div style={{
                position: "absolute",
                top: 0,
                right: "25%",
                width: 1,
                height: "100%",
                background: "linear-gradient(to bottom, transparent, rgba(245,158,11,0.08), transparent)",
                transform: "rotate(15deg)",
                pointerEvents: "none",
              }} />

              <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{
                      fontSize: 9,
                      fontWeight: 700,
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      color: "#f59e0b",
                      background: "rgba(245,158,11,0.12)",
                      border: "1px solid rgba(245,158,11,0.3)",
                      padding: "5px 12px",
                      borderRadius: 4,
                    }}>
                      Exclusive Tool
                    </span>
                  </div>
                  <h3 style={{ fontSize: 26, fontWeight: 900, color: "#e2e4f0", margin: "0 0 12px", letterSpacing: "-0.8px" }}>
                    Item Synergy Explorer
                  </h3>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.75, margin: "0 0 24px", maxWidth: 500 }}>
                    Pick any item — instantly see every trigger chain, combo, and synergy stack grouped by trigger type, category match, and effect overlap. Filter by hero, size, or keyword. No other Bazaar resource has this.
                  </p>
                  <span style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    color: "#000",
                    fontSize: 13,
                    fontWeight: 800,
                    padding: "11px 24px",
                    borderRadius: 8,
                    boxShadow: "0 4px 20px rgba(245,158,11,0.3)",
                  }}>
                    Explore Synergies →
                  </span>
                </div>

                {/* Visual — item chain */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", opacity: 0.5 }}>
                  {["Crossbow", "→", "Trigger", "→", "Scope"].map((t, i) => (
                    i % 2 === 1
                      ? <span key={i} style={{ color: "#f59e0b", fontSize: 18, fontWeight: 300 }}>{t}</span>
                      : <div key={i} style={{
                          background: "#15162a",
                          border: "1px solid #252640",
                          borderRadius: 10,
                          padding: "12px 16px",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#6b7280",
                          whiteSpace: "nowrap",
                        }}>{t}</div>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* ── TOOL GRID ────────────────────────────────────── */}
        <div className="reveal" style={{ marginBottom: 72 }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
            gap: 14,
          }}>
            {TOOLS.map(tool => (
              <ToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
