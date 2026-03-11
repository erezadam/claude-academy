# Vercel Minimal Design System

> Use this design system to build high-contrast, geometric interfaces on pure black backgrounds. The core philosophy is **maximum contrast, monospace code aesthetics, geometric precision, and developer-first clarity**.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#000000` | Primary background -- pure black |
| Background Secondary | `#0a0a0a` | Barely-there secondary bg |
| Surface | `#111111` | Cards, code blocks, elevated elements |
| Text Primary | `#ffffff` | Headlines, primary text -- pure white |
| Text Secondary | `#888888` | Body text, descriptions |
| Text Tertiary | `#666666` | Captions, placeholders, comments |
| Link Blue | `#0070f3` | Links, active elements, badges |
| Link Hover | `#3291ff` | Link hover state |
| Border | `#333333` | All borders, dividers, card outlines |
| Border Light | `#222222` | Subtle internal borders |
| Error | `#ee0000` | Error states |
| Warning | `#f5a623` | Warning states |

When building with this design system, **there are only two primary colors: black and white**. Blue is reserved exclusively for links and interactive accents. There is no primary brand color -- the contrast IS the brand.

---

## Typography

- **Font Stack**: `"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif`
- **Monospace**: `"Geist Mono", "SF Mono", "Fira Code", Menlo, Consolas, monospace`

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| H1 | 64px | 700 | 1.1 | -0.05em |
| H2 | 40px | 700 | 1.15 | -0.04em |
| H3 | 24px | 600 | 1.3 | -0.02em |
| H4 | 18px | 600 | 1.4 | -0.01em |
| Body | 16px | 400 | 1.6 | 0 |
| Body Small | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 400 | 1.5 | 0 |

When building with this design system, use **tight negative letter-spacing on headlines** (-0.05em for H1). This creates the characteristic geometric, compressed look. Body text uses the secondary gray color, never white.

---

## Spacing

- **Hero padding**: 120px top, 80px bottom
- **Section padding**: 80px vertical (48px on mobile)
- **Card padding**: 24px
- **Grid gap**: 24px
- **Max content width**: 1100px
- **Navigation height**: 64px
- **Edge padding**: 24px minimum

---

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | 12px |
| Buttons | 8px (or 100px for pill variant) |
| Inputs | 8px |
| Code blocks | 8px |
| Inline code | 5px |
| Badges | 100px (pill) |
| Small elements | 5px |

---

## Shadows

- **No shadows used on dark backgrounds.** Separation comes from borders (`#333333`) exclusively. The only visual depth comes from surface color stepping (`#000` -> `#111`).

---

## Component Patterns

### Navigation
- Sticky with backdrop blur: `background: rgba(0,0,0,0.8)`, `backdrop-filter: saturate(180%) blur(12px)`
- Height: 64px, `#333333` bottom border
- **Triangle logo**: CSS triangle using `border-left: 11px transparent; border-right: 11px transparent; border-bottom: 19px solid white`
- Left: logo + brand name + nav links
- Right: Log In (ghost) + Sign Up (primary white)

### Buttons
- **Primary**: White background, black text. Hover: dims to `#888` background
- **Secondary**: Transparent with `#333` border. Hover: border brightens to white
- **Ghost**: No border or background, gray text. Hover: text brightens to white
- Padding: sm (6px 12px), default (10px 20px), lg (12px 28px)
- Pill variant available with `border-radius: 100px`

### Code Blocks
- `#111111` background, `#333333` border, 8px radius
- Optional header bar with filename and copy button
- Monospace font, 14px, 1.7 line height
- Syntax colors: keyword `#ff7b72`, string `#a5d6ff`, function `#d2a8ff`, comment `#666666`, tag `#7ee787`

### Inline Code
- `#111111` background, `#333333` border, 5px radius
- 2px 8px padding, white text
- Monospace font, 14px

### Cards
- `#000000` background (same as page) with `#333333` border, 12px radius
- Or `#111111` surface variant
- Hover: border brightens to `#888`
- No shadow -- border only

### Feature Grid
- 3-column grid standard (collapses on mobile)
- Cards with icon/emoji (28px), title (H4), description (body-sm gray), and blue arrow link

### Hero Sections
- Centered, large headline with extreme letter-spacing
- Gray body text below, max-width 600px
- Two buttons: white primary + bordered secondary
- Optional: terminal-style command line below (`$ npx create-next-app`)
- Optional: deploy status indicator with pulsing dot

### Geometric Separators
- Horizontal line with a rotated diamond in the center
- Line: `#333` 1px, Diamond: 6px square rotated 45deg, filled `#333`

### Form Inputs
- Black background, `#333` border, 8px radius
- Focus: border brightens to white, no glow ring (clean and sharp)
- Placeholder: `#666` tertiary gray

### Badges
- Pill-shaped (100px radius) with 1px border
- Tinted background at 10% opacity of badge color
- Variants: default (gray border), blue, success, error, warning

### Footer
- 4-column layout with link groups
- H4 section titles (white), gray links
- Bottom bar with copyright and small logo
- `#333` border-top separator

---

## Responsive Behavior

- At `max-width: 767px`:
  - H1: 36px, H2: 28px
  - Hero padding: 80px top
  - Grids collapse to single column
  - Nav links hide
  - Footer stacks vertically
  - Command line and tech grid collapse

---

## Signature Elements

These unique patterns define the Vercel aesthetic:

1. **Triangle logo** -- the upward-pointing triangle in pure white
2. **Terminal command line** -- styled input showing `$ npx create-next-app` with blinking cursor
3. **Diamond separators** -- geometric section dividers
4. **Deploy status pill** -- pulsing dot + URL + "Ready" badge
5. **Announcement banner** -- thin bar above nav with link

---

## Key Principles

1. **Black and white create the hierarchy** -- no gradients, no noise, pure contrast
2. **Code is a first-class citizen** -- monospace blocks are prominent, not hidden
3. **Geometry over decoration** -- triangles, diamonds, clean rectangles
4. **Borders are the only depth cue** -- never use shadows on pure black
5. **Developer confidence** -- the UI should feel like a CLI made visual
6. **Speed is implied** -- minimal elements, fast transitions (0.15s), no animation excess
