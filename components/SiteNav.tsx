import Link from "next/link";

// ניווט עליון קבוע — ארבעה פריטים בלבד.
const ITEMS = [
  { href: "/start", label: "התחלה" },
  { href: "/guides", label: "מדריכים" },
  { href: "/commands-list", label: "פקודות" },
  { href: "/tools", label: "כלים" },
];

export default function SiteNav() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-6">
        <Link href="/" className="font-bold text-gray-900">
          האקדמיה של קלוד
        </Link>
        <div className="flex items-center gap-5 text-sm">
          {ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-900 hover:text-blue-700"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
