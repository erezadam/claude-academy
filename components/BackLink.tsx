"use client";

import { usePathname, useRouter } from "next/navigation";

// חזרה לאחור בכל דף (מוסתר בעמוד הבית): history.back עם נסיגה לעמוד הבית.
export default function BackLink() {
  const pathname = usePathname();
  const router = useRouter();
  if (pathname === "/") return null;
  return (
    <button
      type="button"
      onClick={() => (window.history.length > 1 ? router.back() : router.push("/"))}
      className="btn btn-secondary"
      style={{ fontSize: 13, padding: "4px 10px" }}
      aria-label="חזרה לעמוד הקודם"
    >
      → חזרה
    </button>
  );
}
