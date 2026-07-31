import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      /*
       * המותג "תכלס AI" בשורש; האקדמיה תחת /academy. כל כתובת היסטורית
       * מפנה ישירות ליעד הסופי בקפיצת 308 אחת — אפס שרשראות:
       * גם הדורות הישנים (/article, /category, /project-wizard.html) וגם
       * הדור הקודם (/a, /m, /start...) מצביעים היישר על /academy/... .
       */
      // דור 1 — המבנה המקורי
      { source: "/article/:category/:slug", destination: "/academy/a/:slug", permanent: true },
      { source: "/category/git", destination: "/academy/m/code", permanent: true },
      { source: "/category/scheduling", destination: "/academy/m/automate", permanent: true },
      { source: "/category/project-docs", destination: "/academy/m/spec", permanent: true },
      { source: "/category/:slug", destination: "/academy/guides", permanent: true },
      { source: "/project-wizard.html", destination: "/academy/wizard", permanent: true },
      // דור 2 — נתיבי השורש שעברו ל-/academy
      { source: "/a/:slug", destination: "/academy/a/:slug", permanent: true },
      { source: "/m/:mission", destination: "/academy/m/:mission", permanent: true },
      { source: "/start", destination: "/academy/start", permanent: true },
      { source: "/guides", destination: "/academy/guides", permanent: true },
      { source: "/tools", destination: "/academy/tools", permanent: true },
      { source: "/commands-list", destination: "/academy/commands-list", permanent: true },
      { source: "/wizard", destination: "/academy/wizard", permanent: true },
      { source: "/feedback", destination: "/academy/feedback", permanent: true },
      { source: "/design-gallery/:path*", destination: "/academy/design-gallery/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
