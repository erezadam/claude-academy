import { defineConfig } from "@playwright/test";

// בדיקת עשן ויזואלית — רצה על build ייצור אמיתי. ר' tests/visual/smoke.spec.ts.
export default defineConfig({
  testDir: "./tests/visual",
  timeout: 30_000,
  retries: 1,
  use: {
    baseURL: "http://localhost:4700",
    viewport: { width: 1280, height: 900 },
  },
  webServer: {
    command: "npm run start -- -p 4700",
    url: "http://localhost:4700",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
