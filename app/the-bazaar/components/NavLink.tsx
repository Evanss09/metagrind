"use client";

import Link from "next/link";

export function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "#9ca3af",
        textDecoration: "none",
        padding: "6px 12px",
        borderRadius: 6,
        transition: "color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#e2e4f0";
        e.currentTarget.style.background = "#1e2236";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#9ca3af";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {label}
    </Link>
  );
}
