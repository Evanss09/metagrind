"use client";
import Link from "next/link";

type ChangeEntry = { item: string; note: string };

type PatchEntry = {
  version: string;
  date: string;
  label?: string;
  nerfs?: ChangeEntry[];
  buffs?: ChangeEntry[];
  newContent?: ChangeEntry[];
  summary?: string;
};

type SeasonBlock = {
  season: number;
  name: string;
  archived?: boolean;
  patches: PatchEntry[];
};

const SEASONS: SeasonBlock[] = [
  {
    season: 15,
    name: "Season 15",
    patches: [
      {
        version: "15.1",
        date: "2026-06-04",
        label: "Hot Fix 15.1",
        nerfs: [
          {
            item: "Freeze Interactions",
            note: "Several infinite-freeze chains patched. Back-to-back freeze stacking that bypassed cooldown resolution has been corrected.",
          },
        ],
        buffs: [],
        newContent: [],
      },
      {
        version: "15.0",
        date: "2026-06-01",
        label: "Season 15 Launch",
        nerfs: [
          {
            item: "Anaconda",
            note: "Cooldown increased. Was enabling infinite attack loops when paired with certain haste sources — now gated behind a hard cooldown floor.",
          },
        ],
        buffs: [
          {
            item: "Shield Generator",
            note: "Standout Karnok item this season. Start of Combat synergy now resolves before the first attack tick, making early shield stacking significantly more consistent.",
          },
        ],
        newContent: [
          {
            item: "Season 15 Launch",
            note: "Season 15 is live. New ranked season, updated neutral item pool, and meta reset.",
          },
          {
            item: "Mak",
            note: "Mak is featured this season — strong meta presence at launch with top-tier S15 builds.",
          },
          {
            item: "Karnok Meta Items",
            note: "Shield Generator and Weights confirmed as top Karnok items in the S15 opening meta.",
          },
        ],
      },
    ],
  },
  {
    season: 14,
    name: "Monster Mayhem",
    archived: true,
    patches: [
      {
        version: "14.0",
        date: "2026-05-06",
        label: "Monster Mayhem",
        summary:
          "19 new neutral items added to the pool. Karnok DLC hero added — Rage-based brawler with unique Start of Combat scaling. Major item rebalance across all heroes. Freeze mechanics updated to be more consistent. Extensive buff/nerf pass on mid-tier builds.",
      },
    ],
  },
];

function DateBadge({ date }: { date: string }) {
  return (
    <span style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 0.5,
      color: "#6b7280",
      background: "#0e0f18",
      border: "1px solid #1e2236",
      padding: "3px 10px",
      borderRadius: 4,
      whiteSpace: "nowrap",
    }}>
      {date}
    </span>
  );
}

function ChangeSection({
  label,
  color,
  borderColor,
  bgColor,
  entries,
}: {
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
  entries: ChangeEntry[];
}) {
  if (!entries || entries.length === 0) return null;
  return (
    <div style={{
      background: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: 10,
      padding: "16px 20px",
      marginBottom: 12,
    }}>
      <div style={{
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: 2,
        textTransform: "uppercase",
        color,
        marginBottom: 12,
      }}>
        {label}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {entries.map((entry, i) => (
          <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#e2e4f0",
              minWidth: 130,
              flexShrink: 0,
              lineHeight: 1.6,
            }}>
              {entry.item}
            </span>
            <span style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7 }}>
              {entry.note}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PatchCard({ patch, archived }: { patch: PatchEntry; archived?: boolean }) {
  return (
    <div style={{
      background: archived ? "#0c0d14" : "#111218",
      border: "1px solid #1e2236",
      borderRadius: 14,
      padding: "28px 32px",
      marginBottom: 16,
      opacity: archived ? 0.72 : 1,
    }}>
      {/* Card header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22, flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "-0.2px",
            color: archived ? "#6b7280" : "#e2e4f0",
          }}>
            {patch.label ?? `Patch ${patch.version}`}
          </span>
          {archived && (
            <span style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
              color: "#4b5563",
              background: "rgba(75,85,99,0.12)",
              border: "1px solid #1e2236",
              padding: "2px 8px",
              borderRadius: 4,
            }}>
              Archived
            </span>
          )}
        </div>
        <DateBadge date={patch.date} />
      </div>

      {/* Summary (archived patches) */}
      {patch.summary && (
        <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.75, margin: 0 }}>
          {patch.summary}
        </p>
      )}

      {/* Change sections */}
      {patch.nerfs && patch.nerfs.length > 0 && (
        <ChangeSection
          label="Nerfs"
          color="#ef4444"
          borderColor="rgba(239,68,68,0.2)"
          bgColor="rgba(239,68,68,0.04)"
          entries={patch.nerfs}
        />
      )}
      {patch.buffs && patch.buffs.length > 0 && (
        <ChangeSection
          label="Buffs"
          color="#22c55e"
          borderColor="rgba(34,197,94,0.2)"
          bgColor="rgba(34,197,94,0.04)"
          entries={patch.buffs}
        />
      )}
      {patch.newContent && patch.newContent.length > 0 && (
        <ChangeSection
          label="New Content"
          color="#f59e0b"
          borderColor="rgba(245,158,11,0.2)"
          bgColor="rgba(245,158,11,0.04)"
          entries={patch.newContent}
        />
      )}
    </div>
  );
}

export default function PatchNotesPage() {
  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          Season 15 · Hot Fix 15.1
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Patch Notes
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Balance changes, new content, and hot fixes. Updated 2026-06-04.
        </p>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
        {[
          { label: "Nerfs", color: "#ef4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)" },
          { label: "Buffs", color: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
          { label: "New Content", color: "#f59e0b", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)" },
        ].map(item => (
          <div key={item.label} style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            background: "#111218",
            border: "1px solid #1e2236",
            borderRadius: 8,
            padding: "7px 14px",
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: item.color,
              flexShrink: 0,
              boxShadow: `0 0 6px ${item.color}80`,
            }} />
            <span style={{ fontSize: 12, color: "#6b7280" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Season blocks */}
      {SEASONS.map(season => (
        <div key={season.season} style={{ marginBottom: 48 }}>
          {/* Season header */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: season.archived ? "#4b5563" : "#f59e0b",
              background: season.archived ? "rgba(75,85,99,0.08)" : "rgba(245,158,11,0.1)",
              border: `1px solid ${season.archived ? "rgba(75,85,99,0.2)" : "rgba(245,158,11,0.25)"}`,
              padding: "5px 14px",
              borderRadius: 20,
            }}>
              {!season.archived && (
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#f59e0b",
                  animation: "dotPulse 2s ease-in-out infinite",
                  display: "inline-block",
                }} />
              )}
              Season {season.season} · {season.name}
              {season.archived && " · Archived"}
            </div>
            <div style={{ height: 1, flex: 1, background: `linear-gradient(to right, ${season.archived ? "rgba(75,85,99,0.2)" : "rgba(245,158,11,0.2)"}, transparent)` }} />
          </div>

          {/* Patch cards */}
          {season.patches.map(patch => (
            <PatchCard key={patch.version} patch={patch} archived={season.archived} />
          ))}
        </div>
      ))}

      {/* Back link */}
      <div style={{ paddingTop: 24, borderTop: "1px solid #1e2236" }}>
        <Link href="/the-bazaar" style={{
          fontSize: 13,
          color: "#6b7280",
          textDecoration: "none",
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          transition: "color 0.15s",
        }}>
          ← Back to Toolkit
        </Link>
      </div>
    </div>
  );
}
