import { notFound } from "next/navigation";
import Link from "next/link";
import heroesData from "@/public/data/heroes.json";
import itemsData from "@/public/data/items.json";

const HERO_SPLASH: Record<string, string> = {
  vanessa:   "/images/heroes/vanessa-hq.jpg",
  pygmalien: "/images/heroes/pygmalien-hq.jpg",
  dooley:    "/images/heroes/dooley-hq.jpg",
  mak:       "/images/heroes/mak-hq.jpg",
  stelle:    "/images/heroes/stelle-hq.jpg",
  jules:     "/images/heroes/jules-hq.jpg",
  karnok:    "/images/heroes/karnok-hq.png",
};

const TIER_COLORS: Record<string, string> = {
  S: "#f97316", "A+": "#22c55e", A: "#86efac",
  "B+": "#3b82f6", B: "#7dd3fc", "B-": "#6b7280",
};

export function generateStaticParams() {
  return heroesData.map((h) => ({ hero: h.id }));
}

export default async function HeroPage({ params }: { params: Promise<{ hero: string }> }) {
  const { hero: heroId } = await params;
  const hero = heroesData.find((h) => h.id === heroId);
  if (!hero) notFound();

  const heroItems = itemsData.filter((i) => i.hero === heroId);
  const splashImg = HERO_SPLASH[heroId];

  return (
    <div>
      {/* Back nav */}
      <Link href="/the-bazaar/heroes" style={{
        fontSize: 12, color: "#6b7280", textDecoration: "none",
        display: "inline-flex", alignItems: "center", gap: 4,
        marginBottom: 20,
        transition: "color 0.15s",
      }}>
        ← All Heroes
      </Link>

      {/* ── PORTRAIT HEADER ───────────────────────────────── */}
      <div style={{
        position: "relative",
        height: 320,
        borderRadius: 16,
        overflow: "hidden",
        marginBottom: 36,
        border: `1px solid ${hero.color}30`,
        boxShadow: `0 0 60px ${hero.color}15`,
      }}>
        {/* Portrait image */}
        {splashImg && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={splashImg}
            alt={hero.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: heroId === "karnok" ? "center 25%" : "top center",
            }}
          />
        )}

        {/* Gradient overlays */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to right,
            rgba(7,8,15,0.95) 0%,
            rgba(7,8,15,0.7)  35%,
            rgba(7,8,15,0.3)  60%,
            rgba(7,8,15,0.4)  100%
          )`,
        }} />
        <div style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(
            to top,
            rgba(7,8,15,0.6) 0%,
            transparent 50%
          )`,
        }} />
        {/* Hero color atmospheric glow */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 70% 50%, ${hero.color}10 0%, transparent 50%)`,
        }} />

        {/* Content */}
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "28px 32px",
        }}>
          {/* DLC + difficulty row */}
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            {hero.dlc && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                color: "#f59e0b",
                background: "rgba(7,8,15,0.75)",
                border: "1px solid rgba(245,158,11,0.35)",
                padding: "4px 10px", borderRadius: 5,
                backdropFilter: "blur(8px)",
              }}>
                DLC · ${hero.price}
              </span>
            )}
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
              color: hero.color,
              background: "rgba(7,8,15,0.75)",
              border: `1px solid ${hero.color}40`,
              padding: "4px 10px", borderRadius: 5,
              backdropFilter: "blur(8px)",
            }}>
              {hero.difficulty}
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 56px)",
            fontWeight: 900,
            letterSpacing: "-2px",
            color: "#e2e4f0",
            margin: "0 0 8px",
            lineHeight: 1,
            textShadow: "0 2px 20px rgba(0,0,0,0.8)",
          }}>
            {hero.name}
          </h1>

          <div style={{ fontSize: 14, color: "#9ca3af", marginBottom: 12, textShadow: "0 1px 8px rgba(0,0,0,0.8)" }}>
            {hero.role}
          </div>

          {/* Archetype tags */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {hero.archetype.map((a) => (
              <span key={a} style={{
                fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
                color: hero.color,
                background: `${hero.color}18`,
                border: `1px solid ${hero.color}35`,
                padding: "4px 10px", borderRadius: 4,
                backdropFilter: "blur(6px)",
              }}>
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── QUICK STATS ───────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10, marginBottom: 36 }}>
        {[
          ["Role", hero.role],
          ["Early Game", hero.earlyGame],
          ["Late Game", hero.lateGame],
          ["Economy", hero.economyDependence],
          ["Damage", hero.primaryDamage.join(" · ")],
          ["Difficulty", hero.difficulty],
        ].map(([k, v]) => (
          <div key={k} style={{
            background: "#0e0f18",
            border: "1px solid #1e2236",
            borderRadius: 10,
            padding: "14px 16px",
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 5 }}>{k}</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* ── TAGLINE / UNIQUE MECHANIC ─────────────────────── */}
      <div style={{
        background: `${hero.color}0c`,
        border: `1px solid ${hero.color}25`,
        borderRadius: 12,
        padding: "22px 26px",
        marginBottom: 36,
      }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: hero.color, marginBottom: 8 }}>
          Unique Mechanic
        </div>
        <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.75, margin: 0 }}>{hero.uniqueMechanic}</p>
      </div>

      {/* ── PLAYSTYLE ─────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e2e4f0", marginBottom: 12, letterSpacing: "-0.3px" }}>Playstyle</h2>
        <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.85, margin: 0 }}>{hero.playstyle}</p>
      </div>

      {/* ── BUILDS ────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e2e4f0", marginBottom: 16, letterSpacing: "-0.3px" }}>Top Builds — Season 14</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {hero.topBuilds.map((build) => {
            const tc = TIER_COLORS[build.tier] || "#6b7280";
            return (
              <div key={build.name} style={{
                background: "#0e0f18",
                border: "1px solid #1e2236",
                borderRadius: 10,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                  background: `${tc}18`,
                  border: `1px solid ${tc}45`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 900, color: tc,
                }}>
                  {build.tier}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e4f0", marginBottom: 6 }}>{build.name}</div>
                  <div style={{ display: "flex", gap: 12, marginBottom: 8, fontSize: 11 }}>
                    <span style={{ color: "#4b5563" }}>Early: <span style={{ color: "#9ca3af" }}>{build.earlyGame}</span></span>
                    <span style={{ color: "#4b5563" }}>Late: <span style={{ color: "#9ca3af" }}>{build.lateGame}</span></span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {build.coreItems.map((item) => (
                      <span key={item} style={{
                        fontSize: 11, fontWeight: 600,
                        color: hero.color,
                        background: `${hero.color}12`,
                        border: `1px solid ${hero.color}28`,
                        padding: "2px 8px", borderRadius: 4,
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── TIPS ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e2e4f0", marginBottom: 14, letterSpacing: "-0.3px" }}>Expert Tips</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {hero.tips.map((tip, i) => (
            <div key={i} style={{
              display: "flex", gap: 12,
              background: "#0e0f18",
              border: "1px solid #1e2236",
              borderRadius: 8,
              padding: "14px 18px",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: 5,
                background: `${hero.color}18`,
                border: `1px solid ${hero.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: 11, fontWeight: 700, color: hero.color,
              }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.65, margin: 0 }}>{tip}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── MATCHUPS ──────────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 40 }}>
        <div style={{ background: "#07130d", border: "1px solid #15803d30", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#22c55e", marginBottom: 12 }}>
            Strong Against
          </div>
          {hero.strongAgainst.map((s, i) => (
            <div key={i} style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, padding: "5px 0", borderBottom: "1px solid rgba(21,128,61,0.12)" }}>
              {s}
            </div>
          ))}
        </div>
        <div style={{ background: "#130707", border: "1px solid #dc262630", borderRadius: 12, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ef4444", marginBottom: 12 }}>
            Vulnerable To
          </div>
          {hero.counters.map((c, i) => (
            <div key={i} style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, padding: "5px 0", borderBottom: "1px solid rgba(220,38,38,0.1)" }}>
              {c}
            </div>
          ))}
        </div>
      </div>

      {/* ── LORE ──────────────────────────────────────────── */}
      <div style={{
        background: "#0e0f18",
        border: "1px solid #1e2236",
        borderRadius: 12,
        padding: "20px 24px",
        marginBottom: 36,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle hero color in corner */}
        <div style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${hero.color}08 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#4b5563", marginBottom: 10 }}>
          Lore
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.75, margin: 0, fontStyle: "italic" }}>{hero.lore}</p>
      </div>

      {/* ── KEY ITEMS ─────────────────────────────────────── */}
      {heroItems.length > 0 && (
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e2e4f0", marginBottom: 14, letterSpacing: "-0.3px" }}>Key Items</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
            {heroItems.map((item) => (
              <div key={item.id} style={{ background: "#0e0f18", border: "1px solid #1e2236", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase",
                    color: "#6b7280", background: "#1e2236", padding: "2px 6px", borderRadius: 3,
                  }}>
                    {item.size}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0" }}>{item.name}</span>
                  {item.season14Note && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "#22c55e", background: "#22c55e15", padding: "1px 5px", borderRadius: 3 }}>S14</span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.55, margin: "0 0 6px" }}>{item.description}</p>
                {item.synergyNote && (
                  <p style={{ fontSize: 11, color: "#4b5563", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>{item.synergyNote}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── KARNOK SECRET CALLOUT ─────────────────────────── */}
      {heroId === "karnok" && (
        <div style={{
          background: "#130505",
          border: "1px solid #dc2626",
          borderRadius: 12,
          padding: "22px 26px",
          position: "relative",
          overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -40, right: -40, width: 160, height: 160,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#dc2626", marginBottom: 12 }}>
            Secret Interaction — Karnok Only
          </div>
          <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.75, margin: "0 0 14px" }}>
            <strong style={{ color: "#e2e4f0" }}>Sled + Any Mask = Instant 100 Rage</strong> — even without the Mask on your board.
            If any Mask (Wolf, Bear, or Boar) is in your stash and you have a Sled on your board, activating Sled grants 100 Rage instantly.
            This is not documented in the game UI.
          </p>
          <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: "#e2e4f0" }}>Jacket Exodia setup:</strong> Leather Jacket only requires you to <em>reach</em> Enrage —
            it doesn&apos;t require staying Enraged continuously. Use the Sled+Mask trick to reliably trigger Enrage at will,
            then Leather Jacket activates invulnerability during that window.
          </p>
        </div>
      )}
    </div>
  );
}
