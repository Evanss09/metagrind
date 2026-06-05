import buildsData from "@/public/data/builds.json";

const TIER_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  S: { bg: "#7c2d12", text: "#fed7aa", border: "#c2410c" },
  "A+": { bg: "#14532d", text: "#bbf7d0", border: "#16a34a" },
  A: { bg: "#052e16", text: "#86efac", border: "#15803d" },
  "B+": { bg: "#1e3a5f", text: "#93c5fd", border: "#2563eb" },
  B: { bg: "#1e2a3a", text: "#7dd3fc", border: "#0284c7" },
  "B-": { bg: "#1e2236", text: "#94a3b8", border: "#334155" },
};

const HERO_COLORS: Record<string, string> = {
  vanessa: "#3b82f6", pygmalien: "#f59e0b", dooley: "#06b6d4",
  mak: "#10b981", stelle: "#f97316", jules: "#ec4899", karnok: "#dc2626",
};

const HERO_NAMES: Record<string, string> = {
  vanessa: "Vanessa", pygmalien: "Pygmalien", dooley: "Dooley",
  mak: "Mak", stelle: "Stelle", jules: "Jules", karnok: "Karnok",
};

function TierBadge({ tier }: { tier: string }) {
  const c = TIER_COLORS[tier] || TIER_COLORS["B-"];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: 8, flexShrink: 0,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
      fontSize: 12, fontWeight: 900, letterSpacing: "-0.5px",
    }}>
      {tier}
    </span>
  );
}

function GameBadge({ label, value, color }: { label: string; value: string; color: string }) {
  const good = ["Fantastic", "Great", "Above Average", "Good", "Great"].includes(value);
  const bad = ["Poor", "Below Average"].includes(value);
  const textColor = bad ? "#ef4444" : good && (value === "Fantastic" || value === "Great") ? "#22c55e" : "#9ca3af";
  return (
    <span style={{ fontSize: 11 }}>
      <span style={{ color: "#4b5563" }}>{label}: </span>
      <span style={{ color: textColor, fontWeight: 600 }}>{value}</span>
    </span>
  );
}

export default function TierListPage() {
  const { tierList, season15Changes, season, patchName, lastUpdated } = buildsData;

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          Season {season} · {patchName}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Season 15 Tier List
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Every hero, every viable build, ranked for the current meta. Updated {lastUpdated}.
        </p>
      </div>

      {/* Key rating */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
        {Object.entries(TIER_COLORS).map(([tier, c]) => (
          <div key={tier} style={{ display: "flex", alignItems: "center", gap: 6, background: "#111218", border: "1px solid #1e2236", borderRadius: 8, padding: "8px 14px" }}>
            <TierBadge tier={tier} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>
              {tier === "S" ? "Broken / Near-Unbeatable" :
               tier === "A+" ? "Meta-Defining" :
               tier === "A" ? "Strong & Reliable" :
               tier === "B+" ? "Solid, Situational Edge" :
               tier === "B" ? "Viable, Some Weaknesses" :
               "Niche / Needs Support"}
            </span>
          </div>
        ))}
      </div>

      {/* Tier list per hero */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {tierList.map((heroData) => {
          const hColor = HERO_COLORS[heroData.hero];
          return (
            <div key={heroData.hero} style={{ background: "#111218", border: "1px solid #1e2236", borderRadius: 12, overflow: "hidden" }}>
              <div style={{ background: "#0d0e16", borderBottom: "1px solid #1e2236", padding: "14px 22px", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: hColor }} />
                <span style={{ fontSize: 16, fontWeight: 800, color: "#e2e4f0" }}>{HERO_NAMES[heroData.hero]}</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#4b5563" }}>
                  {heroData.builds.length} builds
                </span>
              </div>

              <div style={{ padding: "6px 12px 12px" }}>
                {heroData.builds.map((build) => (
                  <div
                    key={build.name}
                    style={{
                      display: "flex", alignItems: "flex-start", gap: 14,
                      padding: "12px 10px", borderBottom: "1px solid #1a1b24",
                    }}
                  >
                    <TierBadge tier={build.tier} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e4f0", marginBottom: 4 }}>
                        {build.name}
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 6 }}>
                        <GameBadge label="Early" value={build.earlyGame} color={hColor} />
                        <GameBadge label="Late" value={build.lateGame} color={hColor} />
                      </div>

                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                        {build.coreItems.map((item) => (
                          <span key={item} style={{
                            fontSize: 11, fontWeight: 600, color: hColor,
                            background: `${hColor}15`, border: `1px solid ${hColor}30`,
                            padding: "2px 8px", borderRadius: 4,
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>

                      <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>{build.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Season 15 changes */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#e2e4f0", marginBottom: 6 }}>Season 15 Balance Changes</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>Patch: {patchName} · {season15Changes.newItems.length} new neutral items added</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
          <div style={{ background: "#0d1f14", border: "1px solid #15803d40", borderRadius: 12, padding: "20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#22c55e", marginBottom: 14 }}>
              Buffs ({season15Changes.buffs.length})
            </div>
            {season15Changes.buffs.map((b) => (
              <div key={b.item} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #15803d20" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0" }}>{b.item}</span>
                  <span style={{ fontSize: 10, color: "#4b5563", textTransform: "capitalize" }}>({b.hero})</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{b.change}</p>
              </div>
            ))}
          </div>

          <div style={{ background: "#1f0d0d", border: "1px solid #dc262640", borderRadius: 12, padding: "20px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ef4444", marginBottom: 14 }}>
              Nerfs ({season15Changes.nerfs.length})
            </div>
            {season15Changes.nerfs.map((n) => (
              <div key={n.item} style={{ marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #dc262620" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0" }}>{n.item}</span>
                  <span style={{ fontSize: 10, color: "#4b5563", textTransform: "capitalize" }}>({n.hero})</span>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{n.change}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "#111218", border: "1px solid #1e2236", borderRadius: 12, padding: "20px" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#f59e0b", marginBottom: 14 }}>
            New Neutral Items ({season15Changes.newItems.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {season15Changes.newItems.map((item) => (
              <span key={item} style={{
                fontSize: 12, fontWeight: 600, color: "#9ca3af",
                background: "#1e2236", border: "1px solid #262840",
                padding: "4px 10px", borderRadius: 6,
              }}>
                {item}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#4b5563", margin: "14px 0 0", lineHeight: 1.6 }}>
            Season 15 new items not yet fully documented. Community analysis ongoing.
          </p>
        </div>
      </div>
    </div>
  );
}
