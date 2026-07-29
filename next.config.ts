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
    ];
  },
};

export default nextConfig;
