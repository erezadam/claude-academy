import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "אשף פרויקט חדש",
  description:
    "ענה על כמה שאלות וקבל את כל פקודות ההתחלה מוכנות להרצה — Git, CLAUDE.md ו-GitHub.",
  alternates: { canonical: "/wizard" },
  openGraph: {
    type: "website",
    title: "אשף פרויקט חדש",
    description:
      "ענה על כמה שאלות וקבל את כל פקודות ההתחלה מוכנות להרצה — Git, CLAUDE.md ו-GitHub.",
    url: "/wizard",
    locale: "he_IL",
  },
};

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
