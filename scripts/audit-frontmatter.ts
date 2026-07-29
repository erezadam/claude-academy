// audit של frontmatter בכל knowledge-base: אילו שדות מודל-התוכן חסרים בכל
// מאמר, ואיזה ערך מוצע לכל שדה חסר. מדפיס בלבד — לעולם לא כותב לקבצים.
// הרצה: node --experimental-strip-types scripts/audit-frontmatter.ts [--tsv]
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const FIELDS = ["level", "mission", "type", "tool", "origin", "timeMinutes"] as const;

const MISSION_BY_CATEGORY: Record<string, string> = {
  git: "code",
  "claude-code": "daily",
  scheduling: "automate",
  workflows: "code",
  guides: "advanced",
  "project-docs": "spec",
};

function proposeLevel(data: Record<string, unknown>): string {
  if (data.layer === "basic") return "beginner";
  if (data.layer === "advanced") return "advanced";
  return "intermediate";
}

function proposeType(slug: string, category: string): string {
  if (slug.startsWith("slash-") || slug.startsWith("git-") || slug === "cli-flags" || slug === "keyboard-shortcuts")
    return "reference";
  if (category === "workflows" || category === "project-docs") return "recipe";
  return "guide";
}

function proposeTool(slug: string, category: string): string {
  if (category === "git") return "git";
  if (slug.includes("git")) return "both";
  return "claude-code";
}

function proposeTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(2, Math.round(words / 180));
}

const root = path.join(process.cwd(), "knowledge-base");
const rows: string[][] = [];
for (const dir of fs.readdirSync(root).filter((d) => fs.statSync(path.join(root, d)).isDirectory())) {
  for (const file of fs.readdirSync(path.join(root, dir)).filter((f) => f.endsWith(".md")).sort()) {
    const raw = fs.readFileSync(path.join(root, dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    const proposed: Record<string, string | number> = {
      level: proposeLevel(data),
      mission: MISSION_BY_CATEGORY[dir] ?? "daily",
      type: proposeType(slug, dir),
      tool: proposeTool(slug, dir),
      origin: data.source_url ? "official" : "original",
      timeMinutes: proposeTime(content),
    };
    const cells = FIELDS.map((f) =>
      data[f] !== undefined ? `${data[f]} ✓` : `→ ${proposed[f]}`
    );
    rows.push([`${dir}/${slug}`, ...cells]);
  }
}

const header = ["article", ...FIELDS];
if (process.argv.includes("--tsv")) {
  console.log(header.join("\t"));
  for (const r of rows) console.log(r.join("\t"));
} else {
  const widths = header.map((h, i) => Math.max(h.length, ...rows.map((r) => r[i].length)));
  const line = (r: string[]) => r.map((c, i) => c.padEnd(widths[i])).join("  ");
  console.log(line(header));
  console.log(widths.map((w) => "-".repeat(w)).join("  "));
  for (const r of rows) console.log(line(r));
  const missing = rows.filter((r) => r.slice(1).some((c) => c.startsWith("→"))).length;
  console.log(`\n${rows.length} articles, ${missing} with missing fields (✓ = קיים בקובץ, → = ערך מוצע)`);
}
