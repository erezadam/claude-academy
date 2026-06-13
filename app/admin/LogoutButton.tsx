"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={loading}
      className="text-sm font-medium text-gray-500 underline hover:no-underline disabled:opacity-40"
    >
      {loading ? "יוצא…" : "יציאה"}
    </button>
  );
}
