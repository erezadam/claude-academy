#!/usr/bin/env node
// IndexNow: דחיפת כל כתובות האתר לאינדקס של בינג (שמזין את Copilot וחלק
// מ-ChatGPT) בלי Bing Webmaster Tools. סקריפט ידני בלבד — לא ב-CI.
// שימוש: node scripts/indexnow.mjs
import fs from "node:fs";

const HOST = "www.tachlesai.co.il";
const KEY = "7d18b3e91840dd637e7d73230fff0d7d";
const BASE = `https://${HOST}`;

// אותה רשימת כתובות כמו ב-sitemap: סטטיים + משימות + כל המאמרים.
const staticPaths = ["/", "/commands-list", "/design-gallery/", "/wizard", "/start", "/guides", "/tools", "/feedback"];
const missions = ["start", "daily", "code", "automate", "spec", "advanced"].map((m) => `/m/${m}`);
const articles = fs
  .readdirSync("knowledge-base", { recursive: true })
  .filter((f) => f.endsWith(".md"))
  .map((f) => `/a/${f.split("/").pop().replace(/\.md$/, "")}`);

const urlList = [...staticPaths, ...missions, ...articles].map((p) => `${BASE}${p}`);

const res = await fetch("https://api.indexnow.org/IndexNow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `${BASE}/${KEY}.txt`,
    urlList,
  }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} · נשלחו ${urlList.length} כתובות`);
if (res.status === 403) console.log("403 = קובץ המפתח לא נמצא ב-keyLocation — ודא שהאתר פרוס עם public/*.txt");
