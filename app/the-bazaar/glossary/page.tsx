"use client";
import { useState, useMemo } from "react";
import keywordsData from "@/public/data/keywords.json";
import enchantmentsData from "@/public/data/enchantments.json";

type Keyword = (typeof keywordsData)[0];
type Enchantment = (typeof enchantmentsData)[0];

const TIER_COLORS: Record<string, string> = {
  S: "#f97316", "A+": "#22c55e", A: "#86efac",
  "B+": "#3b82f6", B: "#7dd3fc", "B-": "#6b7280",
};

const CATEGORY_COLORS: Record<string, string> = {
  damage: "#ef4444",
  control: "#93c5fd",
  defense: "#22c55e",
  speed: "#fbbf24",
  offense: "#f97316",
  resource: "#d97706",
  property: "#7dd3fc",
  offensive: "#ef4444",
  defensive: "#22c55e",
};

export default function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"keywords" | "enchantments">("keywords");

  const filteredKeywords = useMemo(() => {
    if (!search) return keywordsData;
    const q = search.toLowerCase();
    return keywordsData.filter(
      (k) =>
        k.name.toLowerCase().includes(q) ||
        k.description.toLowerCase().includes(q) ||
        k.category.toLowerCase().includes(q) ||
        k.edgeCase.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredEnchantments = useMemo(() => {
    if (!search) return enchantmentsData;
    const q = search.toLowerCase();
    return enchantmentsData.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.effect.toLowerCase().includes(q) ||
        e.notes.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          Complete Reference
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Keyword Glossary
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Every mechanic with interaction notes and edge cases. The interactions that cost you fights.
        </p>
      </div>

      {/* Search + tabs */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap", alignItems: "center" }}>
        <input
          placeholder="Search keywords, effects, interactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 260px", padding: "9px 14px",
            background: "#111218", border: "1px solid #1e2236", borderRadius: 8,
            color: "#e2e4f0", fontSize: 13, outline: "none",
          }}
        />
        <div style={{ display: "flex", gap: 4 }}>
          {(["keywords", "enchantments"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 600,
                background: tab === t ? "#f59e0b" : "#111218",
                color: tab === t ? "#000" : "#6b7280",
                border: tab === t ? "1px solid #f59e0b" : "1px solid #1e2236",
                cursor: "pointer",
              }}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)} ({t === "keywords" ? keywordsData.length : enchantmentsData.length})
            </button>
          ))}
        </div>
      </div>

      {/* Keywords */}
      {tab === "keywords" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {filteredKeywords.length === 0 && (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#4b5563" }}>No results.</div>
          )}
          {filteredKeywords.map((kw) => {
            const catColor = CATEGORY_COLORS[kw.category] || "#9ca3af";
            return (
              <div key={kw.id} style={{ background: "#111218", border: `1px solid ${kw.color}30`, borderRadius: 12, overflow: "hidden" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px", borderBottom: "1px solid #1e2236" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: kw.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 17, fontWeight: 800, color: "#e2e4f0" }}>{kw.name}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: catColor, background: `${catColor}15`, padding: "2px 8px", borderRadius: 4 }}>
                    {kw.category}
                  </span>
                  <span style={{ fontSize: 11, color: "#4b5563", marginLeft: 4 }}>Targets: {kw.targets}</span>
                </div>

                <div style={{ padding: "16px 20px" }}>
                  <p style={{ fontSize: 14, color: "#9ca3af", lineHeight: 1.7, margin: "0 0 14px" }}>{kw.description}</p>

                  {kw.formula && (
                    <div style={{ background: "#0d0e16", borderRadius: 6, padding: "8px 12px", marginBottom: 14, fontFamily: "monospace", fontSize: 13, color: kw.color }}>
                      {kw.formula}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Applied By</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {kw.appliedBy.map((a) => (
                          <span key={a} style={{ fontSize: 11, color: kw.color, background: `${kw.color}15`, padding: "2px 8px", borderRadius: 4, border: `1px solid ${kw.color}30` }}>{a}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Countered By</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {kw.counters.map((c) => (
                          <span key={c} style={{ fontSize: 11, color: "#ef4444", background: "#ef444415", padding: "2px 8px", borderRadius: 4, border: "1px solid #ef444430" }}>{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {kw.interactions.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Interactions</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {kw.interactions.map((inter, i) => (
                          <div key={i} style={{ display: "flex", gap: 8, fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>
                            <span style={{ color: kw.color, flexShrink: 0 }}>›</span>
                            <span>{inter}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{ background: "#1a1424", borderLeft: `3px solid #f59e0b`, padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "#f59e0b", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Edge Case</div>
                    <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{kw.edgeCase}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enchantments */}
      {tab === "enchantments" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
          {filteredEnchantments.length === 0 && (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 0", color: "#4b5563" }}>No results.</div>
          )}
          {filteredEnchantments.map((ench) => {
            const tierColor = TIER_COLORS[ench.tier] || "#6b7280";
            return (
              <div key={ench.id} style={{ background: "#111218", border: `1px solid ${ench.color}30`, borderRadius: 12, padding: "18px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: ench.color }} />
                    <span style={{ fontSize: 15, fontWeight: 800, color: "#e2e4f0" }}>{ench.name}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, color: tierColor,
                    background: `${tierColor}20`, border: `1px solid ${tierColor}40`,
                    padding: "2px 8px", borderRadius: 4
                  }}>
                    {ench.tier}
                  </span>
                </div>

                <div style={{ fontSize: 13, fontWeight: 600, color: ench.color, marginBottom: 10 }}>
                  {ench.effect}
                </div>

                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: "0 0 12px" }}>{ench.notes}</p>

                <div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "#4b5563", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Best On</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {ench.bestOn.map((b, i) => (
                      <div key={i} style={{ fontSize: 11, color: "#9ca3af", display: "flex", gap: 6, alignItems: "flex-start" }}>
                        <span style={{ color: ench.color, flexShrink: 0 }}>·</span>
                        {b}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
