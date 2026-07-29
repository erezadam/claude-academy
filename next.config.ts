import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // מבנה ה-URL הישן /article/[category]/[slug] → כתובת שטוחה /a/[slug].
      // permanent: true ⇒ 308, נשמר ע"י מנועי חיפוש וסימניות.
      {
        source: "/article/:category/:slug",
        destination: "/a/:slug",
        permanent: true,
      },
      // האשף הישן ב-public הוסר (כפילות מול /wizard). ייתכן שאונדקס —
      // redirect במקום 404.
      {
        source: "/project-wizard.html",
        destination: "/wizard",
        permanent: true,
      },
      // עמודי הקטגוריה הישנים (לפי תיקייה) פינו את מקומם לציר המשימות.
      // תיקיות חד-משמעיות → המשימה; מעורבות → מפתח המדריכים.
      { source: "/category/git", destination: "/m/code", permanent: true },
      { source: "/category/scheduling", destination: "/m/automate", permanent: true },
      { source: "/category/project-docs", destination: "/m/spec", permanent: true },
      { source: "/category/:slug", destination: "/guides", permanent: true },
    ];
  },
};

export default nextConfig;
