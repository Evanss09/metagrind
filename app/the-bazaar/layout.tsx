import type { Metadata } from "next";
import Link from "next/link";
import { NavLink } from "./components/NavLink";

export const metadata: Metadata = {
  title: "The Bazaar Toolkit — MetaGrind",
  description:
    "The Bazaar's deepest interactive resource for hardcore players. Item synergy explorer, damage calculators, Season 14 tier list, Karnok guide, and expert build breakdowns.",
  keywords: "The Bazaar, builds, tier list, synergy explorer, calculator, Karnok, Mak, Vanessa, Pygmalien, Dooley, Stelle, Jules",
};

const NAV = [
  { href: "/the-bazaar/synergy",     label: "Synergy" },
  { href: "/the-bazaar/calculators", label: "Calculators" },
  { href: "/the-bazaar/tier-list",   label: "Tier List" },
  { href: "/the-bazaar/heroes",      label: "Heroes" },
  { href: "/the-bazaar/glossary",    label: "Glossary" },
];

export default function BazaarLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Bazaar sub-nav sits below the MetaGrind top nav */}
      <div style={{
        background: "rgba(7,8,15,0.6)",
        borderBottom: "1px solid rgba(30,34,54,0.7)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}>
        <div style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 46,
        }}>
          {/* Back breadcrumb — official logo */}
          <Link href="/the-bazaar" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand/TheBazaarLogo.png"
              alt="The Bazaar"
              style={{ height: 34, width: "auto", objectFit: "contain" }}
            />
          </Link>

          <nav style={{ display: "flex", gap: 2, alignItems: "center" }}>
            {NAV.map(n => <NavLink key={n.href} href={n.href} label={n.label} />)}
            <div style={{
              marginLeft: 10,
              fontSize: 9, fontWeight: 700, letterSpacing: 0.5,
              color: "#f59e0b",
              background: "rgba(245,158,11,0.1)",
              border: "1px solid rgba(245,158,11,0.2)",
              padding: "4px 8px", borderRadius: 4, whiteSpace: "nowrap",
            }}>
              S14
            </div>
          </nav>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 80px" }}>
        {children}
      </div>
    </>
  );
}
