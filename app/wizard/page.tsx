"use client";

import { useState, useRef } from "react";
import Link from "next/link";

/* ── Types ── */
interface SpecState {
  type: string;
  users: string;
  db: string;
  size: string;
  level: string;
  feature: string;
  audience: string;
}

interface WizardState {
  fe: string;
  be: string;
  auth: string;
  repo: string;
  name: string;
  ghUser: string;
  path: string;
  spec: SpecState;
}

/* ── Data ── */
const FE_OPTIONS = [
  {
    value: "Next.js",
    tag: "מומלץ",
    desc: "Framework מלא — דפים, ניתוב, API routes, SEO. הבחירה לאפליקציות עם משתמשים ונתונים.",
    when: "דוגמאות: GymIQ, אפליקציית fitness, SaaS, dashboard, חנות",
  },
  {
    value: "React",
    tag: "גמיש",
    desc: "ספריית UI בלבד — אתה מחבר backend נפרד. טוב כשיש כבר API קיים.",
    when: "דוגמאות: admin panel פנימי, אפליקציה שמתחברת ל-API קיים",
  },
  {
    value: "Vue",
    tag: "קל ללמידה",
    desc: "דומה ל-React אבל syntax פשוט יותר. פחות boilerplate, מהיר להתחלה.",
    when: "דוגמאות: כלי פנימי לצוות, prototype, פרויקט לימוד ראשון",
  },
  {
    value: "HTML/CSS",
    tag: "פשוט",
    desc: "ללא framework — קובץ HTML שנפתח בדפדפן. אין build, אין npm.",
    when: "דוגמאות: דף נחיתה, CV דיגיטלי, demo ללקוח",
  },
  {
    value: "ללא",
    label: "ללא — Backend בלבד",
    desc: "אין UI בכלל. רק לוגיקה, שרת, או כלי אוטומציה.",
    when: "דוגמאות: Telegram bot, REST API, script, web scraper",
  },
];

const BE_OPTIONS = ["Node.js", "Python", "Firebase", "Supabase", "ללא"];

const SPEC_QUESTIONS = [
  {
    key: "type" as const,
    label: "מה סוג הפרויקט?",
    options: [
      { value: "app", label: "אפליקציית משתמשים" },
      { value: "saas", label: "SaaS / עסקי" },
      { value: "site", label: "אתר / דף נחיתה" },
      { value: "tool", label: "כלי / script" },
      { value: "api", label: "API / backend בלבד" },
      { value: "learn", label: "פרויקט לימוד" },
    ],
  },
  {
    key: "users" as const,
    label: "האם יש משתמשים שנרשמים / מתחברים?",
    options: [
      { value: "yes", label: "כן — יש חשבונות משתמש" },
      { value: "no", label: "לא — ציבורי / ללא auth" },
    ],
  },
  {
    key: "db" as const,
    label: "האם צריך לשמור נתונים (DB)?",
    options: [
      { value: "realtime", label: "כן — נתונים בזמן אמת" },
      { value: "regular", label: "כן — נתונים רגילים" },
      { value: "no", label: "לא — ללא DB" },
    ],
  },
  {
    key: "size" as const,
    label: "מה גודל הפרויקט הצפוי?",
    options: [
      { value: "small", label: "קטן — כמה דפים" },
      { value: "medium", label: "בינוני — כ-10 דפים" },
      { value: "large", label: "גדול — אפליקציה מלאה" },
    ],
  },
  {
    key: "feature" as const,
    label: "מה הפיצ'ר המרכזי של האפליקציה?",
    options: [
      { value: "feed", label: "פיד / תוכן דינמי" },
      { value: "tracker", label: "מעקב / לוג אישי" },
      { value: "ecommerce", label: "מכירות / תשלומים" },
      { value: "dashboard", label: "dashboard / ניתוח נתונים" },
      { value: "social", label: "חברתי / שיתוף" },
      { value: "ai", label: "AI / מודל שפה" },
      { value: "other", label: "אחר" },
    ],
  },
  {
    key: "audience" as const,
    label: "האם האפליקציה תהיה ציבורית או פנימית?",
    options: [
      { value: "public", label: "ציבורית — כל אחד יכול להירשם" },
      { value: "private", label: "פנימית — לצוות / לקוחות ספציפיים" },
      { value: "personal", label: "אישית — רק אני" },
    ],
  },
  {
    key: "level" as const,
    label: "מה רמת הניסיון שלך?",
    options: [
      { value: "beginner", label: "מתחיל" },
      { value: "mid", label: "בינוני" },
      { value: "senior", label: "מנוסה" },
    ],
  },
];

/* ── CSS ── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');

.wiz-root {
  min-height: 100vh;
  background: #09090b;
  background-image: radial-gradient(ellipse 80% 50% at 50% -10%, rgba(34,211,238,0.07) 0%, transparent 60%);
  color: #fafafa;
  font-family: 'Heebo', sans-serif;
  padding: 0;
  position: relative;
}

.wiz-root::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255,255,255,0.035) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
  z-index: 0;
}

.wiz-root ::selection {
  background: rgba(34,211,238,0.3);
  color: #fafafa;
}

.wiz-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  position: relative;
  z-index: 1;
}

/* Header */
.wiz-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #52525b;
  text-decoration: none;
  margin-bottom: 28px;
  font-weight: 500;
  transition: color 0.25s;
  font-family: 'Heebo', sans-serif;
}
.wiz-back:hover { color: #22d3ee; }
.wiz-back svg { transition: transform 0.25s; }
.wiz-back:hover svg { transform: translateX(3px); }

.wiz-header {
  text-align: center;
  margin-bottom: 44px;
  padding-bottom: 32px;
  border-bottom: 1px solid #1e1e22;
}

.wiz-title {
  font-family: 'Rubik', 'Heebo', sans-serif;
  font-size: 38px;
  font-weight: 900;
  color: #fafafa;
  margin: 0 0 10px;
  letter-spacing: -1px;
  line-height: 1.15;
}

.wiz-subtitle {
  font-size: 16px;
  color: #71717a;
  font-weight: 400;
  margin: 0;
  line-height: 1.5;
}

/* Progress */
.wiz-progress {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 44px;
}

.wiz-prog-bar {
  height: 3px;
  flex: 1;
  background: #27272a;
  border-radius: 4px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.wiz-prog-bar--done {
  background: #22d3ee;
}

.wiz-prog-bar--active {
  background: linear-gradient(90deg, #22d3ee, #06b6d4);
  box-shadow: 0 0 12px rgba(34,211,238,0.35);
  animation: barPulse 2.5s ease-in-out infinite;
}

.wiz-prog-label {
  font-size: 12px;
  color: #52525b;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 500;
  white-space: nowrap;
  min-width: 40px;
  text-align: center;
}

.wiz-prog-label--done {
  color: #22d3ee;
  font-weight: 600;
}

/* Step */
.wiz-step {
  animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.wiz-step-label {
  font-size: 11px;
  font-weight: 600;
  color: #22d3ee;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
  font-family: 'JetBrains Mono', monospace;
}

.wiz-question {
  font-family: 'Rubik', 'Heebo', sans-serif;
  font-size: 30px;
  font-weight: 800;
  color: #fafafa;
  margin-bottom: 8px;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.wiz-hint {
  font-size: 15px;
  color: #71717a;
  font-weight: 400;
  margin-bottom: 28px;
  line-height: 1.6;
}

/* Section */
.wiz-sec {
  font-size: 11px;
  font-weight: 600;
  color: #71717a;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
  margin-top: 28px;
  font-family: 'JetBrains Mono', monospace;
}

/* Input */
.wiz-input {
  width: 100%;
  background: #18181b;
  border: 1.5px solid #27272a;
  border-radius: 10px;
  padding: 14px 16px;
  font-size: 15px;
  color: #fafafa;
  font-family: 'Heebo', sans-serif;
  font-weight: 500;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}
.wiz-input:focus {
  border-color: #22d3ee;
  box-shadow: 0 0 0 3px rgba(34,211,238,0.08);
}
.wiz-input--mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
}
.wiz-input::placeholder { color: #3f3f46; }

/* Spec cards */
.wiz-spec-card {
  background: #111113;
  border: 1.5px solid #1e1e22;
  border-radius: 12px;
  padding: 18px 20px;
  animation: fadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
  transition: border-color 0.2s;
}
.wiz-spec-card:hover { border-color: #27272a; }

.wiz-spec-label {
  font-size: 14px;
  font-weight: 700;
  color: #d4d4d8;
  margin-bottom: 12px;
}

/* Spec chips */
.wiz-spec-chip {
  padding: 8px 15px;
  border-radius: 8px;
  border: 1.5px solid #27272a;
  font-size: 13px;
  font-weight: 600;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  user-select: none;
}
.wiz-spec-chip:hover {
  border-color: #3f3f46;
  color: #d4d4d8;
}
.wiz-spec-chip--sel {
  border-color: #22d3ee !important;
  background: #22d3ee !important;
  color: #09090b !important;
  box-shadow: 0 0 12px rgba(34,211,238,0.2);
}

/* FE cards */
.wiz-fe-card {
  padding: 16px 18px;
  border: 1.5px solid #1e1e22;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s;
  background: #111113;
}
.wiz-fe-card:hover {
  border-color: #3f3f46;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.wiz-fe-card--sel {
  border-color: #22d3ee !important;
  background: #0a1a1e !important;
  box-shadow: 0 0 0 1px rgba(34,211,238,0.15), 0 4px 20px rgba(34,211,238,0.08) !important;
  transform: translateY(-2px) !important;
}

.wiz-fe-name {
  font-size: 16px;
  font-weight: 700;
  color: #fafafa;
}
.wiz-fe-tag {
  font-size: 10px;
  padding: 3px 8px;
  background: #27272a;
  border-radius: 4px;
  color: #71717a;
  font-weight: 600;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.3px;
}
.wiz-fe-card--sel .wiz-fe-tag {
  background: rgba(34,211,238,0.15);
  color: #22d3ee;
}
.wiz-fe-desc {
  font-size: 14px;
  color: #71717a;
  margin-bottom: 4px;
  font-weight: 400;
  line-height: 1.55;
}
.wiz-fe-when {
  font-size: 12px;
  color: #52525b;
  font-weight: 500;
}

/* Chips */
.wiz-chip {
  padding: 10px 18px;
  border-radius: 8px;
  border: 1.5px solid #27272a;
  font-size: 14px;
  font-weight: 600;
  color: #a1a1aa;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  user-select: none;
}
.wiz-chip:hover { border-color: #3f3f46; color: #d4d4d8; }
.wiz-chip--sel {
  border-color: #22d3ee !important;
  background: #22d3ee !important;
  color: #09090b !important;
  box-shadow: 0 0 12px rgba(34,211,238,0.2);
}

/* Toggle */
.wiz-toggle {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1.5px solid #27272a;
  background: transparent;
  color: #a1a1aa;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Heebo', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.wiz-toggle:hover { border-color: #3f3f46; color: #d4d4d8; }
.wiz-toggle--sel {
  border-color: #22d3ee !important;
  background: #22d3ee !important;
  color: #09090b !important;
}

/* Tip */
.wiz-tip {
  padding: 14px 16px;
  background: rgba(34,197,94,0.06);
  border: 1.5px solid rgba(34,197,94,0.2);
  border-radius: 10px;
  font-size: 14px;
  color: #4ade80;
  font-weight: 500;
  margin-bottom: 20px;
  line-height: 1.6;
  animation: fadeUp 0.3s ease both;
}

/* Buttons */
.wiz-btn-row {
  display: flex;
  gap: 10px;
  margin-top: 36px;
  flex-direction: row-reverse;
}

.wiz-btn {
  padding: 13px 30px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: 'Heebo', sans-serif;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}
.wiz-btn--primary {
  background: #22d3ee;
  color: #09090b;
}
.wiz-btn--primary:hover {
  background: #06b6d4;
  box-shadow: 0 0 20px rgba(34,211,238,0.25);
}
.wiz-btn--ghost {
  background: transparent;
  border: 1.5px solid #27272a;
  color: #71717a;
}
.wiz-btn--ghost:hover { border-color: #3f3f46; color: #a1a1aa; }

/* Terminal */
.wiz-terminal {
  background: #0c0c0e;
  border: 1px solid #1e1e22;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 24px;
  transition: border-color 0.2s;
}
.wiz-terminal:hover { border-color: #27272a; }

.wiz-terminal-bar {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  background: #141416;
  border-bottom: 1px solid #1e1e22;
  gap: 10px;
}

.wiz-terminal-dots {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
}

.wiz-terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.wiz-terminal-dot--r { background: #ff5f57; }
.wiz-terminal-dot--y { background: #febc2e; }
.wiz-terminal-dot--g { background: #28c840; }

.wiz-terminal-title {
  flex: 1;
  font-size: 12px;
  font-weight: 600;
  color: #52525b;
  font-family: 'JetBrains Mono', monospace;
  display: flex;
  align-items: center;
  gap: 8px;
}

.wiz-step-badge {
  width: 20px;
  height: 20px;
  background: #22d3ee;
  color: #09090b;
  border-radius: 50%;
  font-size: 11px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 700;
  flex-shrink: 0;
}

.wiz-terminal-body {
  padding: 18px 20px;
  position: relative;
}

.wiz-terminal pre {
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.9;
  color: #d4d4d8;
  white-space: pre-wrap;
  word-break: break-all;
  font-weight: 400;
  margin: 0;
}

.wiz-comment { color: #52525b; }

.wiz-copy {
  position: absolute;
  top: 14px;
  left: 14px;
  padding: 5px 12px;
  border-radius: 6px;
  background: #18181b;
  border: 1px solid #27272a;
  color: #71717a;
  font-size: 11px;
  font-family: 'JetBrains Mono', monospace;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 2;
}
.wiz-copy:hover {
  border-color: #22d3ee;
  color: #22d3ee;
}
.wiz-copy--done {
  background: #22d3ee !important;
  color: #09090b !important;
  border-color: #22d3ee !important;
}

/* Result */
.wiz-result {
  animation: fadeUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.wiz-result-title {
  font-family: 'Rubik', 'Heebo', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #fafafa;
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}

.wiz-result-sub {
  font-size: 15px;
  color: #52525b;
  font-weight: 400;
  margin: 0;
}

.wiz-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 20px 0 32px;
}

.wiz-tag {
  padding: 5px 12px;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 6px;
  font-size: 13px;
  color: #71717a;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
}

.wiz-divider {
  border: none;
  border-top: 1px solid #1e1e22;
  margin: 28px 0;
}

.wiz-restart {
  width: 100%;
  padding: 14px;
  border-radius: 10px;
  background: transparent;
  border: 1.5px solid #1e1e22;
  color: #52525b;
  font-size: 14px;
  font-weight: 600;
  font-family: 'Heebo', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 8px;
}
.wiz-restart:hover {
  border-color: #27272a;
  color: #71717a;
}

/* Animations */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes barPulse {
  0%, 100% { box-shadow: 0 0 8px rgba(34,211,238,0.25); }
  50% { box-shadow: 0 0 18px rgba(34,211,238,0.5); }
}

/* Scrollbar */
.wiz-root::-webkit-scrollbar { width: 6px; }
.wiz-root::-webkit-scrollbar-track { background: #09090b; }
.wiz-root::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }
`;

/* ── Component ── */
export default function WizardPage() {
  const [step, setStep] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [state, setState] = useState<WizardState>({
    fe: "",
    be: "",
    auth: "",
    repo: "",
    name: "",
    ghUser: "",
    path: "",
    spec: { type: "", users: "", db: "", size: "", level: "", feature: "", audience: "" },
  });
  const [tipText, setTipText] = useState("");
  const [showTip, setShowTip] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const ghUserRef = useRef<HTMLInputElement>(null);
  const pathRef = useRef<HTMLInputElement>(null);

  function goTo(n: number) {
    const newState = { ...state };
    if (n >= 2) newState.name = nameRef.current?.value.trim().replace(/\s+/g, "-") || "my-project";
    if (n >= 4) newState.ghUser = ghUserRef.current?.value.trim() || "";
    setState(newState);
    if (n === 3) suggestStack(newState);
    setShowResult(false);
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function suggestStack(s: WizardState) {
    const spec = s.spec;
    if (spec.type === "app" || spec.type === "saas" || spec.users === "yes" || spec.db === "realtime" || spec.size === "large") {
      setShowTip(true);
      setTipText("המלצה לפרויקט שלך: Next.js + Firebase — מתאים לאפליקציות עם משתמשים ונתונים בזמן אמת");
      autoSelect(s, "Next.js", "Firebase", "yes");
    } else if (spec.type === "api") {
      setShowTip(true);
      setTipText("המלצה: Node.js / Python — backend בלבד, ללא frontend");
      autoSelect(s, "ללא", "Node.js", "no");
    } else if (spec.type === "site" || spec.size === "small") {
      setShowTip(true);
      setTipText("המלצה: HTML/CSS או Next.js — אתר פשוט ללא backend מורכב");
    } else if (spec.level === "beginner") {
      setShowTip(true);
      setTipText("המלצה למתחיל: React + Firebase — קל ללמידה עם תוצאות מהירות");
      autoSelect(s, "React", "Firebase", "yes");
    } else {
      setShowTip(false);
    }
  }

  function autoSelect(s: WizardState, fe: string, be: string, auth: string) {
    setState((prev) => ({ ...prev, ...s, fe, be, auth }));
  }

  function specSelect(key: keyof SpecState, value: string) {
    setState((prev) => ({ ...prev, spec: { ...prev.spec, [key]: value } }));
  }

  function selectFe(val: string) {
    setState((prev) => ({ ...prev, fe: val }));
  }

  function selectBe(val: string) {
    setState((prev) => ({ ...prev, be: val }));
  }

  function setToggle(group: "auth" | "repo", val: string) {
    setState((prev) => ({ ...prev, [group]: val }));
  }

  function generate() {
    const ghUser = ghUserRef.current?.value.trim() || "username";
    const projectPath = pathRef.current?.value.trim() || "~/Documents/פרויקטים";
    setState((prev) => ({ ...prev, ghUser, path: projectPath }));
    setShowResult(true);
    setStep(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function copyCode(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    navigator.clipboard.writeText(el.innerText);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function restart() {
    setState({
      fe: "", be: "", auth: "", repo: "", name: "", ghUser: "", path: "",
      spec: { type: "", users: "", db: "", size: "", level: "", feature: "", audience: "" },
    });
    setShowTip(false);
    setShowResult(false);
    setCopiedId(null);
    if (nameRef.current) nameRef.current.value = "";
    if (ghUserRef.current) ghUserRef.current.value = "";
    if (pathRef.current) pathRef.current.value = "";
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ── Result data ── */
  const fe = state.fe || "React";
  const be = state.be || "ללא";
  const name = state.name || "my-project";
  const projectPath = state.path || "~/Documents/פרויקטים";

  const tags = [name, fe !== "ללא" ? fe : null, be !== "ללא" ? be : null, state.auth === "yes" ? "Auth" : null, state.repo === "yes" ? "GitHub" : null].filter(Boolean);

  let initCmd = "";
  if (fe === "Next.js") initCmd = `npx create-next-app@latest ${name} --typescript --tailwind --app`;
  else if (fe === "React") initCmd = `npm create vite@latest ${name} -- --template react-ts`;
  else if (fe === "Vue") initCmd = `npm create vue@latest ${name}`;
  else if (be === "Python") initCmd = `mkdir ${name} && cd ${name} && python3 -m venv venv`;
  else initCmd = `mkdir ${name}`;

  const authLine = state.auth === "yes" ? "כן" : "לא";
  const claudeContent = `# CLAUDE.md — ${name}

## הפרויקט
${state.spec.type ? "סוג: " + state.spec.type : "פרויקט חדש"}

## Stack
- Frontend: ${fe}
- Backend: ${be}
- Auth: ${authLine}

## חוקי ברזל
- No hardcoded secrets — רק environment variables
- No direct push to main — תמיד ענף + PR
- No deploy בלי אישור מפורש
- No silent failures

## פקודות
\`\`\`bash
npm run dev    # שרת פיתוח
npm run build  # build
npm test       # טסטים
\`\`\``;

  const gitLines = [
    "# אתחל Git", "git init", "git add .",
    `git commit -m "feat: initial setup — ${name}"`, "",
    "# צור ענף עבודה", "git checkout -b work/$(date +%Y-%m-%d)",
  ];
  if (state.repo === "yes") {
    gitLines.push("", "# צור GitHub repo", `gh repo create ${name} --public --source=. --remote=origin --push`);
  }

  const cmdSections = [
    {
      id: "cmd1", num: 1, label: "יצירת תיקייה",
      lines: [
        { c: true, t: "# נווט לתיקיית הפרויקטים" },
        { c: false, t: `cd ${projectPath}` },
        { c: false, t: "" },
        { c: true, t: "# צור פרויקט" },
        { c: false, t: initCmd },
        { c: false, t: "" },
        { c: true, t: "# כנס לתיקייה" },
        { c: false, t: `cd ${name}` },
      ],
    },
    {
      id: "cmd2", num: 2, label: "קובץ CLAUDE.md",
      lines: [
        { c: true, t: "# צור CLAUDE.md לפרויקט" },
        { c: false, t: `cat > CLAUDE.md << 'EOF'` },
        { c: false, t: claudeContent },
        { c: false, t: "EOF" },
      ],
    },
    {
      id: "cmd3", num: 3, label: "Git",
      lines: gitLines.map((line) => ({ c: line.startsWith("#"), t: line })),
    },
    {
      id: "cmd4", num: 4, label: "פתח Claude Code",
      lines: [
        { c: true, t: "# פתח Claude Code" },
        { c: false, t: "claude" },
        { c: false, t: "" },
        { c: true, t: "# בתוך Claude Code — הרץ:" },
        { c: false, t: "/init" },
      ],
    },
  ];

  return (
    <>
      <style>{CSS}</style>
      <div className="wiz-root">
        <div className="wiz-container">

          {/* Header */}
          <header className="wiz-header">
            <Link href="/" className="wiz-back">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              חזור לאקדמיה
            </Link>
            <h1 className="wiz-title">אשף פרויקט חדש</h1>
            <p className="wiz-subtitle">ענה על כמה שאלות — תקבל פקודות מוכנות להרצה בטרמינל</p>
          </header>

          {/* Progress */}
          <div className="wiz-progress">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`wiz-prog-bar${showResult || i < step ? " wiz-prog-bar--done" : i === step ? " wiz-prog-bar--active" : ""}`}
              />
            ))}
            <span className={`wiz-prog-label${showResult ? " wiz-prog-label--done" : ""}`}>
              {showResult ? "✓" : `${step} / 5`}
            </span>
          </div>

          {/* ── Step 1: Name ── */}
          {step === 1 && !showResult && (
            <div className="wiz-step">
              <div className="wiz-step-label">שלב 1 — זהות</div>
              <div className="wiz-question">מה שם הפרויקט?</div>
              <div className="wiz-hint">באנגלית, ללא רווחים — ישמש כשם התיקייה ב-GitHub</div>
              <input
                ref={nameRef}
                type="text"
                placeholder="my-project"
                dir="ltr"
                defaultValue={state.name}
                className="wiz-input wiz-input--mono"
              />
              <div className="wiz-btn-row">
                <button className="wiz-btn wiz-btn--primary" onClick={() => goTo(2)}>הבא</button>
              </div>
            </div>
          )}

          {/* ── Step 2: Spec ── */}
          {step === 2 && !showResult && (
            <div className="wiz-step">
              <div className="wiz-step-label">שלב 2 — אפיון</div>
              <div className="wiz-question">ספר לי על הפרויקט</div>
              <div className="wiz-hint">התשובות יעזרו לבחור את ה-stack הנכון אוטומטית</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {SPEC_QUESTIONS.map((q, qi) => (
                  <div
                    key={q.key}
                    className="wiz-spec-card"
                    style={{ animationDelay: `${qi * 60}ms` }}
                  >
                    <div className="wiz-spec-label">{q.label}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {q.options.map((opt) => (
                        <div
                          key={opt.value}
                          className={`wiz-spec-chip${state.spec[q.key] === opt.value ? " wiz-spec-chip--sel" : ""}`}
                          onClick={() => specSelect(q.key, opt.value)}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="wiz-btn-row">
                <button className="wiz-btn wiz-btn--primary" onClick={() => goTo(3)}>הבא — בחר stack</button>
                <button className="wiz-btn wiz-btn--ghost" onClick={() => goTo(1)}>חזור</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Stack ── */}
          {step === 3 && !showResult && (
            <div className="wiz-step">
              <div className="wiz-step-label">שלב 3 — טכנולוגיה</div>
              <div className="wiz-question">איזה stack?</div>
              <div className="wiz-hint">בחר אחד בכל קטגוריה</div>

              {showTip && <div className="wiz-tip">{tipText}</div>}

              <div className="wiz-sec">Frontend</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {FE_OPTIONS.map((opt) => (
                  <div
                    key={opt.value}
                    className={`wiz-fe-card${state.fe === opt.value ? " wiz-fe-card--sel" : ""}`}
                    onClick={() => selectFe(opt.value)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                      <span className="wiz-fe-name">{opt.label || opt.value}</span>
                      {opt.tag && <span className="wiz-fe-tag">{opt.tag}</span>}
                    </div>
                    <div className="wiz-fe-desc">{opt.desc}</div>
                    <div className="wiz-fe-when">{opt.when}</div>
                  </div>
                ))}
              </div>

              <div className="wiz-sec">Backend</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {BE_OPTIONS.map((opt) => (
                  <div
                    key={opt}
                    className={`wiz-chip${state.be === opt ? " wiz-chip--sel" : ""}`}
                    onClick={() => selectBe(opt)}
                  >
                    {opt}
                  </div>
                ))}
              </div>

              <div className="wiz-sec">Authentication</div>
              <div style={{ display: "flex", gap: 8 }}>
                {([["yes", "כן"], ["no", "לא"]] as const).map(([val, label]) => (
                  <div
                    key={val}
                    className={`wiz-toggle${state.auth === val ? " wiz-toggle--sel" : ""}`}
                    onClick={() => setToggle("auth", val)}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="wiz-btn-row">
                <button className="wiz-btn wiz-btn--primary" onClick={() => goTo(4)}>הבא</button>
                <button className="wiz-btn wiz-btn--ghost" onClick={() => goTo(2)}>חזור</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Git ── */}
          {step === 4 && !showResult && (
            <div className="wiz-step">
              <div className="wiz-step-label">שלב 4 — Git</div>
              <div className="wiz-question">הגדרות Git</div>
              <div className="wiz-hint">האם ליצור GitHub repo?</div>

              <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                {([["yes", "כן — צור GitHub repo"], ["no", "לא — רק local"]] as const).map(([val, label]) => (
                  <div
                    key={val}
                    className={`wiz-toggle${state.repo === val ? " wiz-toggle--sel" : ""}`}
                    onClick={() => setToggle("repo", val)}
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="wiz-sec">GitHub username</div>
              <input
                ref={ghUserRef}
                type="text"
                placeholder="username"
                dir="ltr"
                defaultValue={state.ghUser}
                className="wiz-input wiz-input--mono"
              />

              <div className="wiz-btn-row">
                <button className="wiz-btn wiz-btn--primary" onClick={() => goTo(5)}>הבא</button>
                <button className="wiz-btn wiz-btn--ghost" onClick={() => goTo(3)}>חזור</button>
              </div>
            </div>
          )}

          {/* ── Step 5: Path ── */}
          {step === 5 && !showResult && (
            <div className="wiz-step">
              <div className="wiz-step-label">שלב 5 — מיקום</div>
              <div className="wiz-question">איפה ליצור את התיקייה?</div>
              <div className="wiz-hint">הנתיב במק שלך — לחץ Enter כדי לאשר</div>
              <input
                ref={pathRef}
                type="text"
                placeholder="~/Documents/פרויקטים"
                dir="ltr"
                defaultValue={state.path}
                className="wiz-input wiz-input--mono"
                onKeyDown={(e) => { if (e.key === "Enter") generate(); }}
              />
              <div className="wiz-btn-row">
                <button className="wiz-btn wiz-btn--primary" onClick={generate}>צור פקודות</button>
                <button className="wiz-btn wiz-btn--ghost" onClick={() => goTo(4)}>חזור</button>
              </div>
            </div>
          )}

          {/* ── Result ── */}
          {showResult && (
            <div className="wiz-result">
              <div style={{ marginBottom: 20 }}>
                <h2 className="wiz-result-title">{name}</h2>
                <p className="wiz-result-sub">הרץ כל בלוק בנפרד בטרמינל, לפי הסדר</p>
              </div>

              <div className="wiz-tags">
                {tags.map((t) => (
                  <span key={t} className="wiz-tag">{t}</span>
                ))}
              </div>

              <hr className="wiz-divider" />

              {cmdSections.map((section, si) => (
                <div
                  key={section.id}
                  className="wiz-terminal"
                  style={{ animation: `fadeUp 0.4s cubic-bezier(0.16,1,0.3,1) ${si * 100}ms both` }}
                >
                  <div className="wiz-terminal-bar">
                    <div className="wiz-terminal-dots">
                      <span className="wiz-terminal-dot wiz-terminal-dot--r" />
                      <span className="wiz-terminal-dot wiz-terminal-dot--y" />
                      <span className="wiz-terminal-dot wiz-terminal-dot--g" />
                    </div>
                    <div className="wiz-terminal-title">
                      <span className="wiz-step-badge">{section.num}</span>
                      {section.label}
                    </div>
                    <button
                      className={`wiz-copy${copiedId === section.id ? " wiz-copy--done" : ""}`}
                      onClick={() => copyCode(section.id)}
                    >
                      {copiedId === section.id ? "✓ הועתק" : "העתק"}
                    </button>
                  </div>
                  <div className="wiz-terminal-body">
                    <pre id={section.id} dir="ltr">
                      {section.lines.map((line, i) => (
                        <span key={i}>
                          {line.c ? <span className="wiz-comment">{line.t}</span> : line.t}
                          {i < section.lines.length - 1 ? "\n" : ""}
                        </span>
                      ))}
                    </pre>
                  </div>
                </div>
              ))}

              <button className="wiz-restart" onClick={restart}>
                ↺ פרויקט חדש
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
