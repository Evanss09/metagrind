"use client";
import Link from "next/link";
import { useState } from "react";
import heroesData from "@/public/data/heroes.json";

const HERO_SPLASH: Record<string, string> = {
  vanessa:   "/images/heroes/vanessa-hq.jpg",
  pygmalien: "/images/heroes/pygmalien-hq.jpg",
  dooley:    "/images/heroes/dooley-hq.jpg",
  mak:       "/images/heroes/mak-hq.jpg",
  stelle:    "/images/heroes/stelle-hq.jpg",
  jules:     "/images/heroes/jules-hq.jpg",
  karnok:    "/images/heroes/karnok-hq.png",
};

const DIFFICULTY_COLOR: Record<string, string> = {
  Beginner: "#22c55e",
  Intermediate: "#f59e0b",
  Advanced: "#ef4444",
};

const GAME_STAGE_COLOR: Record<string, string> = {
  "Fantastic": "#10b981", "Great": "#22c55e", "Strong": "#22c55e",
  "Good": "#84cc16", "Above Average": "#86efac",
  "Average": "#f59e0b",
  "Below Average": "#f97316", "Weak": "#ef4444", "Poor": "#ef4444",
};

export default function HeroesPage() {
  return (
    <div className="fadein">
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          All 7 Heroes
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Hero Comparison
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Click any hero for a full guide — builds, tips, matchups, and key items.
        </p>
      </div>

      {/* Portrait grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 56 }}>
        {heroesData.map((hero) => (
          <HeroCard key={hero.id} hero={hero} />
        ))}
      </div>

      {/* Quick reference table */}
      <div style={{ background: "#0e0f18", border: "1px solid #1e2236", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ background: "#0b0c15", borderBottom: "1px solid #1e2236", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e4f0" }}>Quick Reference</span>
          <span style={{ fontSize: 11, color: "#4b5563" }}>All heroes side by side</span>
        </div>
        <div style={{ overflowX: "auto" }} className="scrollbar-thin">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #1e2236" }}>
                {["Hero", "Role", "Difficulty", "Early", "Late", "Economy", "Cost", "Unique Mechanic"].map((h) => (
                  <th key={h} style={{
                    padding: "10px 16px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#4b5563",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    whiteSpace: "nowrap",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heroesData.map((hero) => (
                <tr key={hero.id} style={{ borderBottom: "1px solid #13141e" }}>
                  <td style={{ padding: "12px 16px" }}>
                    <Link href={`/the-bazaar/heroes/${hero.id}`} style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        overflow: "hidden",
                        flexShrink: 0,
                        border: `1px solid ${hero.color}40`,
                      }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={HERO_SPLASH[hero.id]}
                          alt={hero.name}
                          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: hero.id === "karnok" ? "center" : "top center" }}
                        />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0" }}>{hero.name}</span>
                    </Link>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{hero.role}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: DIFFICULTY_COLOR[hero.difficulty] }}>{hero.difficulty}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: GAME_STAGE_COLOR[hero.earlyGame] || "#6b7280" }}>{hero.earlyGame}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: GAME_STAGE_COLOR[hero.lateGame] || "#6b7280" }}>{hero.lateGame}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7280" }}>{hero.economyDependence}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: hero.dlc ? "#f59e0b" : "#22c55e" }}>
                    {hero.dlc ? `$${hero.price}` : "Free"}
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 11, color: "#4b5563", maxWidth: 200 }}>
                    {hero.uniqueMechanic.split(":")[0]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function HeroCard({ hero }: { hero: typeof heroesData[number] }) {
  const [hovered, setHovered] = useState(false);
  const img = HERO_SPLASH[hero.id];

  return (
    <Link href={`/the-bazaar/heroes/${hero.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "relative",
          borderRadius: 12,
          overflow: "hidden",
          height: 300,
          border: `1px solid ${hovered ? hero.color + "60" : "#1e2236"}`,
          boxShadow: hovered ? `0 0 28px ${hero.color}20, 0 6px 24px rgba(0,0,0,0.5)` : "0 2px 8px rgba(0,0,0,0.3)",
          transition: "border-color 0.2s, box-shadow 0.2s, transform 0.15s",
          transform: hovered ? "translateY(-3px)" : "none",
          cursor: "pointer",
          background: "#0e0f18",
        }}
      >
        {img && (
          <>
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
                objectPosition: hero.id === "karnok" ? "center center" : "top center",
                transition: "transform 0.3s",
                transform: hovered ? "scale(1.04)" : "scale(1)",
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(
                to bottom,
                rgba(7,8,15,0.05) 0%,
                rgba(7,8,15,0.15) 45%,
                rgba(7,8,15,0.8) 74%,
                rgba(7,8,15,0.97) 100%
              )`,
            }} />
            {hovered && (
              <div style={{
                position: "absolute",
                inset: 0,
                background: `radial-gradient(ellipse at 50% 0%, ${hero.color}12 0%, transparent 60%)`,
                pointerEvents: "none",
              }} />
            )}
          </>
        )}

        {/* Top badges */}
        <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <span style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: DIFFICULTY_COLOR[hero.difficulty],
            background: "rgba(7,8,15,0.8)",
            border: `1px solid ${DIFFICULTY_COLOR[hero.difficulty]}40`,
            padding: "3px 8px",
            borderRadius: 4,
            backdropFilter: "blur(6px)",
          }}>
            {hero.difficulty}
          </span>
          {hero.dlc && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              color: "#f59e0b",
              background: "rgba(7,8,15,0.8)",
              border: "1px solid rgba(245,158,11,0.35)",
              padding: "3px 7px",
              borderRadius: 4,
              backdropFilter: "blur(6px)",
            }}>
              DLC · ${hero.price}
            </span>
          )}
        </div>

        {/* Bottom info */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px 16px 18px" }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: hero.color, marginBottom: 5 }}>
            {hero.archetype[0]}
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#e2e4f0", letterSpacing: "-0.3px", lineHeight: 1.1, marginBottom: 4 }}>
            {hero.name}
          </div>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 10 }}>{hero.role}</div>

          {/* Mini stats */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ fontSize: 10, color: "#4b5563" }}>
              Early <span style={{ color: GAME_STAGE_COLOR[hero.earlyGame] || "#6b7280", fontWeight: 600 }}>{hero.earlyGame}</span>
            </div>
            <div style={{ color: "#1e2236" }}>·</div>
            <div style={{ fontSize: 10, color: "#4b5563" }}>
              Late <span style={{ color: GAME_STAGE_COLOR[hero.lateGame] || "#6b7280", fontWeight: 600 }}>{hero.lateGame}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
