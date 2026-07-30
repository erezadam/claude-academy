import { test, expect, type Page } from "@playwright/test";

/*
 * שומר רגרסיה ויזואלית: כל האימות האחר בודק תוכן ובנייה — אף בדיקה לא
 * שואלת "האם הדף נראה". נכתב אחרי אירוע ‎2026-07-29 שבו האתר הוגש בלי
 * CSS (שרת ישן מול חתימות asset חדשות) וכל השערים נשארו ירוקים.
 * ה-assertions על computed styles, לא על קיום class.
 */

const PAGES = [
  { path: "/", name: "home" },
  { path: "/a/install-first-run", name: "article" },
  { path: "/commands-list", name: "commands-list" },
  { path: "/start", name: "start" },
];

// צבע הקישורים חייב להגיע מטוקן העיצוב, לא מברירת המחדל של הדפדפן.
const BROWSER_DEFAULT_LINK = "rgb(0, 0, 238)";

async function assertStylesApplied(page: Page) {
  // קובץ CSS אחד לפחות נטען בהצלחה וגודלו > 1KB
  const cssBytes = await page.evaluate(async () => {
    const links = [...document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')];
    let total = 0;
    for (const l of links) {
      const r = await fetch(l.href);
      if (r.ok) total += (await r.text()).length;
    }
    return total;
  });
  expect(cssBytes, "לפחות קובץ CSS אחד נטען ומעל 1KB").toBeGreaterThan(1024);

  // למכל ראשי יש max-width שאינו none
  const hasBoundedContainer = await page.evaluate(() =>
    [...document.querySelectorAll("main div, main, header div, body div")].some(
      (el) => getComputedStyle(el).maxWidth !== "none"
    )
  );
  expect(hasBoundedContainer, "מכל ראשי עם max-width").toBe(true);

  // צבע קישורים = accent, לא הדיפולט של הדפדפן
  const linkColor = await page.evaluate(() => {
    const a = document.querySelector('a[href^="/a/"], a[href^="/m/"], a[href^="/start"], nav a');
    return a ? getComputedStyle(a).color : "";
  });
  expect(linkColor, "קישור אינו בכחול הדיפולטי").not.toBe(BROWSER_DEFAULT_LINK);

  // אף אלמנט לא חורג מרוחב ה-viewport
  const overflow = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    return [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().width > vw + 1)
      .slice(0, 3)
      .map((el) => el.tagName);
  });
  expect(overflow, "אין אלמנט רחב מה-viewport").toEqual([]);
}

for (const { path, name } of PAGES) {
  test(`visual smoke: ${name}`, async ({ page }) => {
    const resp = await page.goto(path);
    expect(resp?.status()).toBe(200);
    await assertStylesApplied(page);
    // screenshot כ-artifact בכל ריצה — גם כשעוברים
    await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: false });
  });
}

test("home: h1 hero ≥ 40px and nav has gap", async ({ page }) => {
  await page.goto("/");
  const h1Size = await page.evaluate(() =>
    parseFloat(getComputedStyle(document.querySelector("h1")!).fontSize)
  );
  expect(h1Size, "כותרת ה-hero בגודל hero").toBeGreaterThanOrEqual(40);

  const navGap = await page.evaluate(() => {
    const nav = document.querySelector("nav");
    return nav ? parseFloat(getComputedStyle(nav).gap) : 0;
  });
  expect(navGap, "לניווט יש gap").toBeGreaterThan(0);

  // קישור כלשהו צבוע בדיוק בערך המחושב של טוקן ה-accent (הטוקן הוא המקור).
  const accentLink = await page.evaluate(() => {
    const probe = document.createElement("span");
    probe.style.color = "var(--color-accent-700)";
    document.body.appendChild(probe);
    const accent = getComputedStyle(probe).color;
    probe.remove();
    return [...document.querySelectorAll("a")].some(
      (el) => getComputedStyle(el).color === accent
    );
  });
  expect(accentLink, "קיים קישור בצבע טוקן ה-accent").toBe(true);
});
