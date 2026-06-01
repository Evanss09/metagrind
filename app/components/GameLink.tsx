"use client";
import Link from "next/link";

export function GameLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "#6b7280",
        textDecoration: "none",
        padding: "5px 12px",
        borderRadius: 6,
        transition: "color 0.15s, background 0.15s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#e2e4f0";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#6b7280";
        e.currentTarget.style.background = "transparent";
      }}
    >
      {label}
    </Link>
  );
}
