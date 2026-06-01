"use client";
import { useState } from "react";

function Card({ title, icon, color, children }: { title: string; icon: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "#111218", border: `1px solid ${color}30`, borderRadius: 12, overflow: "hidden" }}>
      <div style={{ borderBottom: `1px solid ${color}30`, padding: "16px 22px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e4f0" }}>{title}</span>
      </div>
      <div style={{ padding: "22px" }}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, min = 0, max, step = 1, hint }: {
  label: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; hint?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%", padding: "10px 14px", background: "#0d0e16",
          border: "1px solid #1e2236", borderRadius: 8, color: "#e2e4f0",
          fontSize: 16, fontWeight: 700, outline: "none",
        }}
      />
      {hint && <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>{hint}</div>}
    </div>
  );
}

function Result({ label, value, color = "#f59e0b", sub }: { label: string; value: string; color?: string; sub?: string }) {
  return (
    <div style={{ background: "#0d0e16", borderRadius: 10, padding: "16px 20px", marginTop: 20, border: `1px solid ${color}30` }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#6b7280", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color, letterSpacing: "-1px" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function BurnCalc() {
  const [burn, setBurn] = useState(20);
  const [shields, setShields] = useState(0);
  const [ticks, setTicks] = useState(0);

  const rawTotal = (burn * (burn + 1)) / 2;
  const afterShield = Math.ceil(rawTotal * (shields > 0 ? 0.5 : 1));
  const decayPerTick = 2;
  const remainingBurn = Math.max(0, burn - ticks * decayPerTick);
  const remainingDamage = (remainingBurn * (remainingBurn + 1)) / 2;

  return (
    <div>
      <Input label="Burn Value Applied" value={burn} onChange={setBurn} min={1} max={500} hint="The number shown on the Burn status effect" />
      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 16 }}>
        <input
          type="checkbox"
          id="shield-check"
          checked={shields > 0}
          onChange={(e) => setShields(e.target.checked ? 1 : 0)}
          style={{ cursor: "pointer" }}
        />
        <label htmlFor="shield-check" style={{ fontSize: 13, color: "#9ca3af", cursor: "pointer" }}>
          Target has Shield (reduces Burn by 50%)
        </label>
      </div>

      <div style={{ background: "#1a1b24", borderRadius: 8, padding: "12px 16px", marginBottom: 4, fontFamily: "monospace" }}>
        <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 4 }}>Formula: N × (N+1) / 2</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {burn} × {burn + 1} / 2 = <span style={{ color: "#f59e0b", fontWeight: 700 }}>{rawTotal}</span>
          {shields > 0 && <span style={{ color: "#6366f1" }}> → {afterShield} after shield</span>}
        </div>
      </div>

      <Result
        label="Total Burn Damage"
        value={afterShield.toLocaleString()}
        color="#ef4444"
        sub={shields > 0 ? `${rawTotal} raw → ${afterShield} after 50% shield reduction` : `Decays from ${burn} → 0, ticking twice per second`}
      />

      <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e2236" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#9ca3af", marginBottom: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Burn Tick Reference
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
          {[5, 10, 15, 20, 30, 50, 75, 100].map((n) => (
            <div key={n} style={{ background: "#0d0e16", borderRadius: 6, padding: "8px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "#4b5563" }}>Burn {n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#ef4444" }}>{((n * (n + 1)) / 2).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PoisonCalc() {
  const [poison, setPoison] = useState(15);
  const [seconds, setSeconds] = useState(10);
  const [regen, setRegen] = useState(0);

  const rawDamage = poison * seconds;
  const netDamage = Math.max(0, (poison - regen) * seconds);
  const effectivePoison = Math.max(0, poison - regen);

  return (
    <div>
      <Input label="Poison Value" value={poison} onChange={setPoison} min={1} max={500} hint="Poison deals this much damage per second, non-decaying" />
      <Input label="Fight Duration (seconds)" value={seconds} onChange={setSeconds} min={1} max={120} hint="Estimate how long your fights last" />
      <Input label="Target's Regen per Second" value={regen} onChange={setRegen} min={0} max={500} hint="Enter 0 if target has no Regen" />

      <div style={{ background: "#1a1b24", borderRadius: 8, padding: "12px 16px", marginBottom: 4, fontFamily: "monospace" }}>
        <div style={{ fontSize: 11, color: "#4b5563", marginBottom: 4 }}>Formula: Poison × Seconds (bypasses Shield)</div>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          {poison} × {seconds}s = <span style={{ color: "#22c55e", fontWeight: 700 }}>{rawDamage}</span>
          {regen > 0 && <span style={{ color: "#10b981" }}> · Net after regen: {netDamage}</span>}
        </div>
      </div>

      <Result
        label="Total Poison Damage"
        value={rawDamage.toLocaleString()}
        color="#22c55e"
        sub="Poison completely bypasses Shield"
      />

      {regen > 0 && (
        <Result
          label="Net Damage (after target Regen)"
          value={netDamage.toLocaleString()}
          color="#10b981"
          sub={`Effective poison: ${effectivePoison}/s. Regen only helps if it exceeds your Poison value.`}
        />
      )}

      <div style={{ marginTop: 16, background: "#1a1f14", borderLeft: "3px solid #22c55e", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#22c55e", marginBottom: 4 }}>KEY RULE</div>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          Poison ignores Shield entirely. It is the primary counter to Pyg's shield-stacking. The only defense is Regen (counters per second) or Heal (removes 1 Poison per trigger).
        </p>
      </div>
    </div>
  );
}

function MaxHpCalc() {
  const [mode, setMode] = useState<"anchor" | "runic" | "skyscraper" | "championship">("anchor");
  const [enemyHp, setEnemyHp] = useState(2000);
  const [ownHp, setOwnHp] = useState(2000);
  const [itemValue, setItemValue] = useState(500);
  const [anchorTier, setAnchorTier] = useState<"bronze" | "gold">("gold");

  const anchorDamage = anchorTier === "gold" ? Math.floor(enemyHp * 0.30) : Math.floor(enemyHp * 0.20);
  const runicDamage = Math.floor(ownHp * 0.15);
  const skyscraperDamage = itemValue * 3;
  const champDamage = Math.floor(ownHp * 0.05);

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {(["anchor", "runic", "skyscraper", "championship"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            style={{
              padding: "7px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600,
              background: mode === m ? "#f59e0b" : "#1e2236",
              color: mode === m ? "#000" : "#9ca3af",
              border: mode === m ? "1px solid #f59e0b" : "1px solid #262840",
              cursor: "pointer",
            }}
          >
            {m === "anchor" ? "Anchor (Enemy HP)" : m === "runic" ? "Runic Claymore (Own HP)" : m === "skyscraper" ? "Skyscraper (Item Value)" : "Championship Belt (Own HP)"}
          </button>
        ))}
      </div>

      {mode === "anchor" && (
        <div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Anchor Tier</div>
            <div style={{ display: "flex", gap: 8 }}>
              {(["bronze", "gold"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setAnchorTier(t)}
                  style={{
                    padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                    background: anchorTier === t ? "#1e2236" : "transparent",
                    color: anchorTier === t ? "#e2e4f0" : "#4b5563",
                    border: anchorTier === t ? "1px solid #262840" : "1px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {t === "bronze" ? "Bronze/Silver (20%)" : "Gold/Diamond (30%)"}
                </button>
              ))}
            </div>
          </div>
          <Input label="Enemy Max Health" value={enemyHp} onChange={setEnemyHp} min={100} max={50000} step={100} hint="Estimate enemy total HP" />
          <Result label={`Anchor Damage (${anchorTier === "gold" ? "30%" : "20%"} Enemy Max HP)`} value={anchorDamage.toLocaleString()} color="#3b82f6" sub="Guaranteed value against any HP pool. Best vs. high-HP targets." />
          <div style={{ marginTop: 16, background: "#1a1d2e", borderLeft: "3px solid #3b82f6", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Anchor scales with enemy health — the tankier your opponent, the better Anchor gets. Against Pyg or any max-health build, Anchor is exceptional.
            </p>
          </div>
        </div>
      )}

      {mode === "runic" && (
        <div>
          <Input label="Your Max Health" value={ownHp} onChange={setOwnHp} min={100} max={50000} step={100} hint="Your total HP pool" />
          <Result label="Runic Claymore Damage (15% Own Max HP)" value={runicDamage.toLocaleString()} color="#dc2626" sub="Buffed from 10% → 15% in Season 14. Stack Max Health for scaling." />
          <div style={{ marginTop: 16, background: "#1f1a1a", borderLeft: "3px solid #dc2626", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Season 14 buff made this Karnok's most flexible S-tier item. For every 1000 Max HP you have, Runic Claymore deals 150 damage per activation.
            </p>
          </div>
        </div>
      )}

      {mode === "skyscraper" && (
        <div>
          <Input label="Total Item Value (gold)" value={itemValue} onChange={setItemValue} min={0} max={5000} step={50} hint="Sum of all your items' purchase prices" />
          <Result label="Skyscraper Damage (3× Item Value)" value={skyscraperDamage.toLocaleString()} color="#f59e0b" sub="Value doubles in combat — actual damage in a fight is 6× your item value." />
          <Result label="In-Combat Damage (6× Item Value)" value={(skyscraperDamage * 2).toLocaleString()} color="#d97706" sub="Skyscraper doubles total item value during combat for damage calculation." />
        </div>
      )}

      {mode === "championship" && (
        <div>
          <Input label="Your Max Health" value={ownHp} onChange={setOwnHp} min={100} max={50000} step={100} hint="Your total HP pool" />
          <Result label="Championship Belt Damage (5% Own Max HP)" value={champDamage.toLocaleString()} color="#9ca3af" sub="New Season 14 neutral item. Max HP scaling in a small 1-slot item." />
          <div style={{ marginTop: 16, background: "#1a1b24", borderLeft: "3px solid #9ca3af", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
              Championship Belt deals damage to adjacent items (not direct player damage). The 5% per activation in a small slot is exceptional value for Max HP builds.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function DurianCalc() {
  const [shield, setShield] = useState(500);
  const [maxHp, setMaxHp] = useState(3000);
  const [dragonmelonPct, setDragonmelonPct] = useState(20);

  const dragonmelonShield = Math.floor(maxHp * (dragonmelonPct / 100));
  const totalShield = shield + dragonmelonShield;
  const durianDamage = totalShield;

  return (
    <div>
      <Input
        label="Base Shield Amount"
        value={shield}
        onChange={setShield}
        min={0}
        max={10000}
        step={50}
        hint="Shield from all other sources combined"
      />
      <Input
        label="Your Max Health"
        value={maxHp}
        onChange={setMaxHp}
        min={100}
        max={50000}
        step={100}
        hint="Used to calculate Dragonmelon shield contribution"
      />
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
          Dragonmelon Tier (Jules)
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {[{ label: "No Dragonmelon", pct: 0 }, { label: "Gold (15%)", pct: 15 }, { label: "Diamond (20%)", pct: 20 }].map((t) => (
            <button
              key={t.pct}
              onClick={() => setDragonmelonPct(t.pct)}
              style={{
                padding: "6px 12px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                background: dragonmelonPct === t.pct ? "#1e2236" : "transparent",
                color: dragonmelonPct === t.pct ? "#e2e4f0" : "#4b5563",
                border: dragonmelonPct === t.pct ? "1px solid #262840" : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {dragonmelonPct > 0 && (
          <div style={{ fontSize: 11, color: "#4b5563", marginTop: 4 }}>
            Dragonmelon adds {dragonmelonShield} shield ({dragonmelonPct}% of {maxHp} Max HP)
          </div>
        )}
      </div>

      <div style={{ background: "#1a1b24", borderRadius: 8, padding: "12px 16px", marginBottom: 4, fontFamily: "monospace" }}>
        <div style={{ fontSize: 13, color: "#6b7280" }}>
          Total Shield: <span style={{ color: "#6366f1", fontWeight: 700 }}>{totalShield}</span>
          {" → "}Durian Damage: <span style={{ color: "#ec4899", fontWeight: 700 }}>{durianDamage}</span>
        </div>
      </div>

      <Result
        label="Durian Damage (= Current Shield)"
        value={durianDamage.toLocaleString()}
        color="#ec4899"
        sub="Durian converts 100% of your current Shield into damage. Stack Shield items, then activate."
      />

      <div style={{ marginTop: 16, background: "#1f1520", borderLeft: "3px solid #ec4899", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#ec4899", marginBottom: 4 }}>BUILD STRATEGY</div>
        <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.6 }}>
          Dragonmelon (Gold tier) gives passive Shield = 15-20% of Max HP. More Max HP = more Shield = more Durian damage.
          Stack Max Health items, add Dragonmelon, then Durian converts the massive shield value into burst damage every activation.
          Can be set up from Level 3 onward.
        </p>
      </div>
    </div>
  );
}

export default function CalculatorsPage() {
  return (
    <div>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#f59e0b", marginBottom: 8 }}>
          Interactive Calculators
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: "#e2e4f0", margin: "0 0 10px", letterSpacing: "-1px" }}>
          Damage Calculators
        </h1>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>
          Burn decay math, Poison DPS, Max Health scaling for Anchor/Runic Claymore/Skyscraper, and the Durian shield conversion.
          Make every number decision with perfect information.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(440px, 1fr))", gap: 20 }}>
        <Card title="Burn Damage" icon="🔥" color="#ef4444">
          <BurnCalc />
        </Card>
        <Card title="Poison DPS" icon="☠️" color="#22c55e">
          <PoisonCalc />
        </Card>
        <Card title="Max Health Scaling" icon="❤️" color="#f59e0b">
          <MaxHpCalc />
        </Card>
        <Card title="Durian Shield Conversion (Jules)" icon="🍈" color="#ec4899">
          <DurianCalc />
        </Card>
      </div>
    </div>
  );
}
