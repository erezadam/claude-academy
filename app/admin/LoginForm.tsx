"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setError(true);
        setPassword("");
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen font-sans bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">אזור אישי</h1>
        <p className="text-sm text-gray-600 mb-8">
          הזן סיסמה כדי לראות את נתוני הכניסות.
        </p>

        {!configured ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            הסיסמה עדיין לא הוגדרה (משתנה הסביבה ADMIN_PASSWORD חסר).
          </div>
        ) : (
          <form onSubmit={submit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="סיסמה"
              autoFocus
              dir="ltr"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none focus:border-gray-900"
            />
            {error && (
              <p className="mt-2 text-sm text-red-600">סיסמה שגויה. נסה שוב.</p>
            )}
            <button
              type="submit"
              disabled={loading || password.length === 0}
              className="mt-4 w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-700 disabled:opacity-40"
            >
              {loading ? "בודק…" : "כניסה"}
            </button>
          </form>
        )}

        <div className="mt-8">
          <Link href="/" className="text-sm text-blue-700 hover:underline">
            &rarr; חזרה לדף הבית
          </Link>
        </div>
      </div>
    </div>
  );
}
