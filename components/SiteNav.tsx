"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import BackLink from "./BackLink";

// ניווט עליון דביק לפי ה-DS: מותג, ארבעה פריטים, ומונה מאמרים במונו.
const ITEMS = [
  { href: "/start", label: "התחלה" },
  { href: "/guides", label: "מדריכים" },
  { href: "/commands-list", label: "פקודות" },
  { href: "/tools", label: "כלים" },
];

export default function SiteNav({ articleCount }: { articleCount: number }) {
  const pathname = usePathname();
  const isCurrent = (href: string) =>
    pathname === href ||
    (href === "/guides" && (pathname.startsWith("/m/") || pathname.startsWith("/a/")));

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-divider)",
      }}
    >
      <nav className="nav" style={{ padding: "14px 40px", gap: 26 }}>
      <BackLink />
      <Link href="/" className="nav-brand" style={{ color: "var(--color-text)" }}>
        האקדמיה של קלוד
      </Link>
      {ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrent(item.href) ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
      <span
        className="font-mono-ds"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          color: "color-mix(in srgb, var(--color-text) 45%, transparent)",
          fontSize: 11,
        }}
      >
        {articleCount} מאמרים
      </span>
      </nav>
    </header>
  );
}
