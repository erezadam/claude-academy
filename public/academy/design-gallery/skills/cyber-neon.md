# Cyber Neon Design System — Skill Prompt

> Use this as a directive when building UI with the Cyber Neon style.

---

## Overview

When building with this design system, create a **dark, futuristic HUD-style interface** with glowing neon accents. The aesthetic is inspired by cyberpunk and sci-fi command centers. Everything should feel like a high-tech monitoring dashboard operating in a darkened control room.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#0a0a0f` | Page/app background — near-black |
| Surface | `#1a1a2f` | Cards, panels, table headers |
| Surface Light | `#222240` | Elevated surfaces, hover states |
| Neon Green | `#00ff88` | Primary accent, success, active states |
| Neon Pink | `#ff0066` | Danger, alerts, errors, secondary accent |
| Neon Cyan | `#00ccff` | Info, links, tertiary accent |
| Neon Yellow | `#ffcc00` | Warnings |
| Neon Purple | `#aa44ff` | Special/rare states |
| Text | `#e0e0f0` | Primary readable text |
| Text Dim | `#8888aa` | Secondary text, labels |
| Text Muted | `#555570` | Disabled, placeholders |
| Border | `#2a2a45` | Default border color |

---

## Glow Effects

Every neon color should have a glow variant used on borders and text:

```css
/* Green glow */
box-shadow: 0 0 10px rgba(0, 255, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.1);
text-shadow: 0 0 20px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2);

/* Pink glow */
box-shadow: 0 0 10px rgba(255, 0, 102, 0.4), 0 0 40px rgba(255, 0, 102, 0.1);

/* Cyan glow */
box-shadow: 0 0 10px rgba(0, 204, 255, 0.4), 0 0 40px rgba(0, 204, 255, 0.1);
```

Apply glow on hover, active states, and key data values — not on everything at once.

---

## Typography

- **Primary font:** 'Rajdhani', sans-serif (or system-ui if unavailable) — weight 400/600/700
- **Monospace font:** 'Share Tech Mono', monospace — for data values, logs, code, IDs
- **All headings:** UPPERCASE with `letter-spacing: 0.05em` to `0.15em`
- **H1:** 48px, neon green with glow text-shadow
- **H2:** 32px, neon cyan with subtle glow
- **H3:** 22px, regular text color
- **Body:** 16px, weight 400, line-height 1.6

---

## Spacing

- Cards/panels inner padding: 24px
- Section gaps: 32-48px
- Grid gaps: 20px
- Inline element gaps: 8-12px

---

## Corners & Shapes

Use **angular/clipped corners** as the signature element:

```css
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
```

For badges, use a simpler angle:
```css
clip-path: polygon(6px 0, 100% 0, calc(100% - 6px) 100%, 0 100%);
```

Standard border-radius is NOT used. Everything is angular.

---

## Component Patterns

### HUD Header
- Sticky, full-width, dark background with `backdrop-filter: blur(10px)`
- Logo: uppercase, bold, neon green with glow, `letter-spacing: 0.15em`
- Nav links: uppercase, 14px, dim color, glow on hover
- Status indicator: pulsing green dot + monospace text

### Stat Cards
- Surface background (`#1a1a2f`), angular clip-path
- Top border highlight: 2px line in the card's accent color with glow
- Label: 12px uppercase, dim color
- Value: 36px monospace, neon colored with glow
- Change indicator: 13px monospace, green for positive, pink for negative

### Data Grid / Table
- Full-width, collapsed borders
- Header: surface bg, 12px uppercase, dim color
- Cells: monospace 13px, subtle bottom borders
- Row hover: faint green background
- Use neon colors on IDs and status text

### Progress Bars
- 6px height, rounded, dark border background
- Fill bar: neon colored with matching glow shadow
- Label row above: flex space-between, monospace, dim labels with colored values

### Buttons
- Angular clip-path (same as cards)
- Border outline style by default: neon colored border + text, transparent bg
- Hover: faint color fill (10% opacity) + glow shadow
- Filled variant: solid neon background, dark text
- Always uppercase, letter-spacing, Rajdhani font

### Form Inputs
- Dark surface background, border `#2a2a45`
- Monospace font for input text
- Focus: cyan border + cyan glow
- Label above: 12px uppercase, dim color

### Badges
- Angular clip-path (small), inline-flex
- Colored border + faint color background (10% opacity)
- Monospace 11px uppercase

### Scanline Effect
Optional but signature. Apply a repeating gradient over the whole page:
```css
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 2px,
    rgba(0, 0, 0, 0.05) 2px, rgba(0, 0, 0, 0.05) 4px
  );
}
```

---

## Animation

- Status dot: pulse animation (opacity 1 to 0.4, 2s ease-in-out infinite)
- Transitions: 0.2-0.3s for hover states
- No bouncy or playful animations — everything should feel precise and mechanical

---

## General Rules

1. **Dark always.** Never use light backgrounds. Surface colors should be barely lighter than the main bg.
2. **Glow with purpose.** Apply glow effects selectively — key data, active states, and hover. Too much glow kills the effect.
3. **Monospace for data.** Any numerical value, ID, code, or log entry uses monospace.
4. **Angular geometry.** Clip-path on major elements. No rounded corners.
5. **Comment-style prefixes.** Use `//` before section titles for the code aesthetic.
6. **High contrast.** Neon colors against the dark background should be vivid and immediate.
7. **HUD metaphor.** Think "command center" — status indicators, data grids, system logs.
