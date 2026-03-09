import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  variable: "--font-heebo",
  subsets: ["hebrew", "latin"],
});

export const metadata: Metadata = {
  title: "האקדמיה של קלוד — מאגר ידע ל-Claude Code ו-Git",
  description:
    "מאגר ידע מקיף בעברית לפקודות Claude Code, פקודות Git, ותהליכי עבודה מומלצים",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} antialiased`}>{children}</body>
    </html>
  );
}
