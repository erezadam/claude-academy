import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "הגדרת מונה כניסות",
  robots: { index: false, follow: false },
};

export default function OptOutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
