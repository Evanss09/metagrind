"use client";
import { useState, useMemo } from "react";
import itemsData from "@/public/data/items.json";
import heroesData from "@/public/data/heroes.json";

type Item = (typeof itemsData)[0];

const HEROES = ["all", ...heroesData.map((h) => h.id), "neutral"] as const;
const HERO_COLORS: Record<string, string> = {
  vanessa: "#3b82f6", pygmalien: "#f59e0b", dooley: "#06b6d4",
  mak: "#10b981", stelle: "#f97316", jules: "#ec4899", karnok: "#dc2626", neutral: "#9ca3af",
};
const SIZES = ["all", "small", "medium", "large"] as const;
const EFFECTS = [
  "all", "damage", "poison", "burn", "freeze", "haste", "slow", "shield",
  "heal", "regen", "charge", "multicast", "max_health", "rage",
] as const;

const EFFECT_COLORS: Record<string, string> = {
  damage: "#ef4444", poison: "#22c55e", burn: "#f97316", freeze: "#93c5fd",
  haste: "#fbbf24", slow: "#6b7280", shield: "#6366f1", heal: "#34d399",
  regen: "#10b981", charge: "#a78bfa", multicast: "#f59e0b", max_health: "#ec4899",
  rage: "#dc2626", buff: "#f59e0b", gold: "#fbbf24", weapon_buff: "#ef4444",
  invulnerability: "#e5e7eb", flying: "#7dd3fc", lifesteal: "#be123c",
  crit_chance: "#fcd34d", max_health_scale: "#ec4899", item_value_scale: "#f59e0b",
};

function EffectBadge({ effect }: { effect: string }) {
  const color = EFFECT_COLORS[effect] || "#9ca3af";
  return (
    <span style={{
      display: "inline-block", fontSize: 10, fontWeight: 700,
      background: `${color}20`, color, border: `1px solid ${color}40`,
      padding: "2px 7px", borderRadius: 4, marginRight: 4, marginBottom: 4,
      textTransform: "uppercase", letterSpacing: 0.5,
    }}>
      {effect.replace(/_/g, " ")}
    </span>
  );
}

function SizeDot({ size }: { size: string }) {
  const w = size === "small" ? 6 : size === "medium" ? 9 : 12;
  return <span style={{ display: "inline-block", width: w, height: w, borderRadius: 2, background: "#f59e0b", marginRight: 6, flexShrink: 0, marginTop: 1 }} />;
}

function ItemCard({ item, onClick, selected }: { item: Item; onClick: () => void; selected: boolean }) {
  const hColor = HERO_COLORS[item.hero] || "#9ca3af";
  return (
    <button
      onClick={onClick}
      style={{
        background: selected ? "#16171f" : "#111218",
        border: `1px solid ${selected ? hColor : "#1e2236"}`,
        borderRadius: 10, padding: "14px 16px", textAlign: "left",
        cursor: "pointer", width: "100%", transition: "all 0.15s",
        outline: selected ? `2px solid ${hColor}60` : "none",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <SizeDot size={item.size} />
        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e4f0", flex: 1 }}>{item.name}</span>
        <span style={{
          fontSize: 9, fontWeight: 700, letterSpacing: 1,
          background: `${hColor}20`, color: hColor,
          padding: "2px 6px", borderRadius: 3, textTransform: "uppercase",
        }}>
          {item.hero}
        </span>
      </div>
      <div style={{ fontSize: 11, color: "#6b7280", marginBottom: 8, lineHeight: 1.5 }}>{item.description}</div>
      <div>
        {item.applies.map((e) => <EffectBadge key={e} effect={e} />)}
      </div>
    </button>
  );
}

function SynergyPanel({ item, allItems }: { item: Item; allItems: Item[] }) {
  const hColor = HERO_COLORS[item.hero] || "#9ca3af";

  const synergies = useMemo(() => {
    const result: { label: string; items: Item[]; reason: string }[] = [];

    // Items that apply what this item triggers on
    if (item.triggers.length > 0 && !item.triggers.includes("on_use") && !item.triggers.includes("always")) {
      const triggerSources = allItems.filter(
        (other) => other.id !== item.id &&
          item.triggers.some((t) => {
            if (t === "on_haste") return other.applies.includes("haste");
            if (t === "on_burn_apply") return other.applies.includes("burn");
            if (t === "on_poison_apply") return other.applies.includes("poison");
            if (t === "on_friend_use") return other.categories.includes("friend");
            if (t === "on_enrage") return other.applies.includes("rage");
            if (t === "on_fly_start" || t === "on_fly_stop") return other.applies.includes("flying") || other.categories.includes("flying");
            if (t === "on_crit") return other.applies.includes("crit_chance");
            if (t === "on_left_use" || t === "on_right_use") return true;
            return false;
          })
      );
      if (triggerSources.length > 0) {
        result.push({ label: "Activates This Item", items: triggerSources, reason: `These items trigger ${item.name}'s effect condition` });
      }
    }

    // Items that are triggered by what this item applies
    const triggeredByThis = allItems.filter(
      (other) =>
        other.id !== item.id &&
        other.triggers.some((t) => {
          if (t === "on_haste") return item.applies.includes("haste");
          if (t === "on_burn_apply") return item.applies.includes("burn");
          if (t === "on_poison_apply") return item.applies.includes("poison");
          if (t === "on_friend_use") return item.categories.includes("friend");
          if (t === "on_enrage") return item.applies.includes("rage");
          if (t === "on_fly_start" || t === "on_fly_stop") return item.applies.includes("flying") || item.categories.includes("flying");
          if (t === "on_crit") return item.applies.includes("crit_chance");
          return false;
        })
    );
    if (triggeredByThis.length > 0) {
      result.push({ label: "Triggered By This Item", items: triggeredByThis, reason: `${item.name} activates these items' effects` });
    }

    // Same category items
    const sameCategory = allItems.filter(
      (other) => other.id !== item.id && item.categories.some((c) => other.categories.includes(c) && c !== "weapon")
    );
    if (sameCategory.length > 0) {
      result.push({ label: `Same Category (${item.categories.join(", ")})`, items: sameCategory.slice(0, 6), reason: "Share a category tag — many synergy skills and items buff all items of the same type" });
    }

    // Items that stack the same effect
    const sameEffect = allItems.filter(
      (other) =>
        other.id !== item.id &&
        item.applies.some((e) => other.applies.includes(e)) &&
        !sameCategory.find((s) => s.id === other.id)
    );
    if (sameEffect.length > 0) {
      result.push({ label: "Stacks Same Effect", items: sameEffect.slice(0, 6), reason: `Both apply ${item.applies.filter((e) => sameEffect.some((s) => s.applies.includes(e))).join(", ")} — stack for scaling` });
    }

    return result;
  }, [item, allItems]);

  return (
    <div style={{ background: "#0d0e16", border: `1px solid ${hColor}40`, borderRadius: 12, padding: "24px", flex: "0 0 380px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{ width: 10, height: 10, borderRadius: 2, background: hColor }} />
        <span style={{ fontSize: 16, fontWeight: 800, color: "#e2e4f0" }}>{item.name}</span>
        <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>
          {item.hero}
        </span>
      </div>

      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: "#6b7280", padding: "2px 8px", background: "#1e2236", borderRadius: 4 }}>
          {item.size}
        </span>
        <span style={{ fontSize: 10, color: "#6b7280", padding: "2px 8px", background: "#1e2236", borderRadius: 4 }}>
          {item.minTier}+
        </span>
        {item.categories.map((c) => (
          <span key={c} style={{ fontSize: 10, color: "#9ca3af", padding: "2px 8px", background: "#1e2236", borderRadius: 4 }}>
            {c}
          </span>
        ))}
      </div>

      <p style={{ fontSize: 13, color: "#9ca3af", lineHeight: 1.6, marginBottom: 14, borderBottom: "1px solid #1e2236", paddingBottom: 14 }}>
        {item.description}
      </p>

      {item.synergyNote && (
        <div style={{ background: "#1a1b24", borderLeft: `3px solid ${hColor}`, padding: "10px 14px", borderRadius: "0 8px 8px 0", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: hColor, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Synergy Note</div>
          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{item.synergyNote}</p>
        </div>
      )}

      {item.season14Note && (
        <div style={{ background: "#1a1f14", borderLeft: "3px solid #22c55e", padding: "10px 14px", borderRadius: "0 8px 8px 0", marginBottom: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#22c55e", letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>S14 Change</div>
          <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.6, margin: 0 }}>{item.season14Note}</p>
        </div>
      )}

      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>
          Applies Effects
        </div>
        <div style={{ marginBottom: 16 }}>
          {item.applies.map((e) => <EffectBadge key={e} effect={e} />)}
        </div>
      </div>

      {synergies.length > 0 && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Synergy Connections
          </div>
          {synergies.map((group) => (
            <div key={group.label} style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#f59e0b", marginBottom: 6 }}>{group.label}</div>
              <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 8, lineHeight: 1.5 }}>{group.reason}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {group.items.map((i) => (
                  <span key={i.id} style={{
                    fontSize: 11, fontWeight: 600, color: HERO_COLORS[i.hero] || "#9ca3af",
                    background: `${HERO_COLORS[i.hero] || "#9ca3af"}15`,
                    border: `1px solid ${HERO_COLORS[i.hero] || "#9ca3af"}30`,
                    padding: "3px 8px", borderRadius: 4,
                  }}>
                    {i.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SynergyPage() {
  const [search, setSearch] = useState("");
  const [heroFilter, setHeroFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [effectFilter, setEffectFilter] = useState("all");
  const [selected, setSelected] = useState<Item | null>(null);

  const filtered = useMemo(() => {
    return itemsData.filter((item) => {
      if (heroFilter !== "all" && item.hero !== heroFilter) return false;
      if (sizeFilter !== "all" && item.size !== sizeFilter) return false;
      if (effectFilter !== "all" && !item.applies.includes(effectFilter) && !item.triggers.some((t) => t.includes(effectFilter))) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.categories.some((c) => c.includes(q)) ||
          item.applies.some((e) => e.includes(q)) ||
          item.hero.includes(q)
        );
      }
      return true;
    });
  }, [search, heroFilter, sizeFilter, effectFilter]);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          Exclusive Tool
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Item Synergy Explorer
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Select any item to see its trigger chain, what activates it, what it activates, and every category synergy. No other site has this.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
        <input
          placeholder="Search items, effects, heroes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: "1 1 220px", minWidth: 200, padding: "9px 14px",
            background: "#111218", border: "1px solid #1e2236", borderRadius: 8,
            color: "#e2e4f0", fontSize: 13, outline: "none",
          }}
        />

        <select
          value={heroFilter}
          onChange={(e) => setHeroFilter(e.target.value)}
          style={{ padding: "9px 14px", background: "#111218", border: "1px solid #1e2236", borderRadius: 8, color: "#e2e4f0", fontSize: 13, cursor: "pointer" }}
        >
          <option value="all">All Heroes</option>
          {heroesData.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
          <option value="neutral">Neutral</option>
        </select>

        <select
          value={sizeFilter}
          onChange={(e) => setSizeFilter(e.target.value)}
          style={{ padding: "9px 14px", background: "#111218", border: "1px solid #1e2236", borderRadius: 8, color: "#e2e4f0", fontSize: 13, cursor: "pointer" }}
        >
          {SIZES.map((s) => <option key={s} value={s}>{s === "all" ? "All Sizes" : s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>

        <select
          value={effectFilter}
          onChange={(e) => setEffectFilter(e.target.value)}
          style={{ padding: "9px 14px", background: "#111218", border: "1px solid #1e2236", borderRadius: 8, color: "#e2e4f0", fontSize: 13, cursor: "pointer" }}
        >
          {EFFECTS.map((e) => <option key={e} value={e}>{e === "all" ? "All Effects" : e.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
        </select>
      </div>

      <div style={{ fontSize: 12, color: "#4b5563", marginBottom: 20 }}>
        {filtered.length} item{filtered.length !== 1 ? "s" : ""} · Click any to explore synergies
      </div>

      {/* Main layout */}
      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        {/* Item grid */}
        <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10, alignContent: "start" }}>
          {filtered.length === 0 ? (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 0", color: "#4b5563" }}>
              No items match your filters.
            </div>
          ) : (
            filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
                selected={selected?.id === item.id}
              />
            ))
          )}
        </div>

        {/* Synergy panel */}
        {selected && (
          <div style={{ position: "sticky", top: 80 }}>
            <SynergyPanel item={selected} allItems={itemsData as Item[]} />
          </div>
        )}
      </div>
    </div>
  );
}
