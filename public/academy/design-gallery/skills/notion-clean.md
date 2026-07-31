# Notion Clean Design System — Skill Prompt

> Use this as a directive when building UI with the Notion Clean style.

---

## Overview

When building with this design system, create a **book-like, minimalist reading experience** inspired by Notion. The design prioritizes content readability, generous whitespace, and clean typography. Every element should feel calm, structured, and emoji-friendly.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#ffffff` | Page background |
| Secondary BG | `#f7f6f3` | Callouts, table headers, hover states, sidebar |
| Text | `#37352f` | Primary text, headings |
| Text Light | `#787774` | Secondary text, labels, metadata |
| Text Lighter | `#9b9a97` | Placeholders, timestamps |
| Accent Blue | `#2eaadc` | Links, primary buttons, focus rings |
| Accent Light | `#e7f3f8` | Info callout background, focus glow |
| Border | `#e9e5e0` | Dividers, table borders, input borders |
| Border Light | `#f0eeeb` | Subtle row separators |

### Tag / Badge Colors

| Name | Background | Text |
|------|-----------|------|
| Blue | `#d3e5ef` | `#183b56` |
| Green | `#dbeddb` | `#1a3a1a` |
| Red | `#ffe2dd` | `#5a1a1a` |
| Yellow | `#fdecc8` | `#5a3e0c` |
| Purple | `#e8deee` | `#3b1a5a` |
| Orange | `#fadec9` | `#4a2510` |
| Pink | `#f5e0e9` | `#5a1a3a` |
| Default | `#f7f6f3` | `#787774` |

---

## Typography

- **Headings:** Georgia, 'Times New Roman', serif — font-weight 700, letter-spacing -0.01em
- **Body:** -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif
- **Code:** 'SFMono-Regular', Menlo, Consolas, monospace
- **Base size:** 16px
- **Line height:** 1.7 for body, 1.3 for headings
- **H1:** 40px, **H2:** 30px, **H3:** 24px

---

## Spacing

Use a consistent spacing scale:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

**Content max-width:** 720px (centered). **Page max-width:** 900px.

---

## Border Radius

- Small elements (tags, code): `3px`
- Medium elements (callouts, inputs): `6px`
- Large elements (cards): `8px`

No fully rounded elements. Keep everything subtly squared.

---

## Shadows

Minimal shadows. Use only on hover for cards:
```css
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```
No other elevation. Rely on borders and background color differences for depth.

---

## Component Patterns

### Page Header
- Large emoji icon (72px) above title
- H1 title (40px, Georgia serif)
- Light description paragraph below
- Properties displayed as label-value pairs (label width: 140px, muted color)

### Callout Boxes
- Flex layout: emoji icon (24px) + content
- Rounded background (`6px`)
- Variants: info (`#e7f3f8`), warning (`#fdecc8`), success (`#dbeddb`), default (`#f7f6f3`)

### Toggle Blocks
- Arrow indicator (`>`) that rotates 90deg when open
- Content indented 28px from left
- CSS class `.open` toggles visibility and arrow rotation

### Tables
- Full-width, collapse borders
- Header: 13px, muted color, secondary background
- Cells: 14px, light bottom border
- Row hover: secondary background

### Tags / Badges
- Inline-flex, padding 2px 8px, border-radius 3px
- Colored background + darker matching text color
- Font-size 12px, font-weight 500

### Buttons
- Default: white bg, border `#e9e5e0`, 14px, padding 6px 12px, radius 3px
- Primary: accent blue bg (`#2eaadc`), white text
- Text: no border, no bg, muted color, hover shows secondary bg

### Form Inputs
- Full width, padding 8px 10px, 14px font
- Border: 1px solid `#e9e5e0`
- Focus: border-color accent blue + 2px accent-light ring

### Gallery Cards
- Grid layout, auto-fill, minmax 240px
- Border 1px, radius 6px, overflow hidden
- Cover area (120px height, gradient or image)
- Body: 16px padding, 14px title, 12px muted metadata

### Todo / Checkbox Lists
- Flex row: checkbox + text
- Checked state: line-through, muted text color
- Accent color on checkbox: `#2eaadc`

### Blockquotes
- 3px solid left border (text color)
- 16px left padding
- Same body font and size

---

## Links

- Underline with border-color (not text-color) — use `text-decoration-color: #e9e5e0`
- Hover: underline darkens to text color
- `text-underline-offset: 2px`

---

## General Rules

1. **Generous whitespace.** When in doubt, add more space between sections.
2. **Content is king.** No decorative elements that don't serve the content.
3. **Emoji as icons.** Use emoji freely for page icons, callout icons, and list markers.
4. **Subtle interactions.** Hover states change background slightly — never dramatic color shifts.
5. **No heavy borders.** 1px max, always in `#e9e5e0` or lighter.
6. **Mobile:** Reduce page padding, stack gallery to single column, reduce H1 to 30px.
