# Material Modern Design System — Skill Prompt

> Use this as a directive when building UI with the Material Modern style.

---

## Overview

When building with this design system, follow **Material Design 3 (Material You)** principles. The aesthetic is clean, purposeful, and accessible with a focus on dynamic color, rounded shapes, and layered elevation. Components use pill shapes (28px radius), tonal color variants, and the Roboto type scale.

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#fafafa` | Page background |
| Surface | `#ffffff` | Cards, app bars, dialogs |
| Surface Variant | `#e7e0ec` | Switches, secondary containers |
| Surface Container | `#f3edf7` | Filled cards, filled inputs, chip backgrounds |
| Surface Container High | `#ece6f0` | Elevated containers |
| Primary | `#6200ee` | Primary buttons, active states, links |
| Primary Light | `#f3e8fd` | Tonal buttons, selected chips, icon containers |
| Primary Dark | `#4a00b4` | Pressed/hover state for primary |
| On Primary | `#ffffff` | Text/icons on primary color |
| Secondary | `#03dac6` | Teal accent, secondary actions |
| Secondary Light | `#e0f7f5` | Secondary tonal surfaces |
| On Secondary | `#000000` | Text on secondary color |
| Error | `#b3261e` | Error states, destructive actions |
| Error Light | `#f9dedc` | Error container |
| Text | `#1c1b1f` | Headings, primary text |
| Text Secondary | `#49454f` | Body text, descriptions |
| Text Muted | `#79747e` | Labels, placeholders, helper text |
| Outline | `#79747e` | Input borders, dividers |
| Outline Variant | `#cac4d0` | Subtle borders, card outlines, chip borders |

---

## Typography (Material Type Scale)

Font: `'Roboto', system-ui, sans-serif`

| Style | Size | Weight | Spacing | Usage |
|-------|------|--------|---------|-------|
| Display Large | 57px | 400 | -0.25px | Hero text (rare) |
| Display Medium | 45px | 400 | 0 | Hero text |
| Headline Large | 32px | 500 | 0 | H1, page titles |
| Headline Medium | 28px | 500 | 0 | H2, section titles |
| Headline Small | 24px | 500 | 0 | H3, card group titles |
| Title Large | 22px | 500 | 0 | Dialog titles, app bar |
| Title Medium | 16px | 500 | 0.15px | Card titles, list item primary |
| Title Small | 14px | 500 | 0.1px | Small titles |
| Body Large | 16px | 400 | 0.5px | Primary body text |
| Body Medium | 14px | 400 | 0.25px | Secondary body text |
| Body Small | 12px | 400 | 0.4px | Captions |
| Label Large | 14px | 500 | 0.1px | Button text, tabs |
| Label Medium | 12px | 500 | 0.5px | Chip text, overlines |
| Label Small | 11px | 500 | 0.5px | Small labels |

**Key rule:** Headings use weight 500 (not 700). Display uses 400. Only buttons and labels use 500.

---

## Spacing

- Card padding: 16px (body), 8px 16px (actions)
- Section gaps: 32-48px
- Card grid gap: 24px
- Chip gap: 8px
- List item padding: 12px 16px

---

## Border Radius

Material Design 3 uses a shape scale:

| Name | Value | Usage |
|------|-------|-------|
| Extra Small | `4px` | Text field outlines |
| Small | `8px` | Chips |
| Medium | `12px` | Cards, icon containers |
| Large | `16px` | FAB, large cards |
| Extra Large | `28px` | Hero sections, large containers |
| Full | `50px` | Buttons, badges, pills, nav items |

**Key rule:** All buttons are fully rounded (pill shape, 50px). Cards use 12px.

---

## Elevation (Shadows)

Material uses tonal elevation. Five levels:

```css
--elevation-1: 0 1px 2px rgba(0,0,0,0.08), 0 1px 3px 1px rgba(0,0,0,0.05);
--elevation-2: 0 1px 2px rgba(0,0,0,0.08), 0 2px 6px 2px rgba(0,0,0,0.06);
--elevation-3: 0 4px 8px 3px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.08);
--elevation-4: 0 6px 10px 4px rgba(0,0,0,0.06), 0 2px 3px rgba(0,0,0,0.1);
--elevation-5: 0 8px 12px 6px rgba(0,0,0,0.06), 0 4px 4px rgba(0,0,0,0.1);
```

| Level | Usage |
|-------|-------|
| 1 | Default cards, app bar |
| 2 | Elevated cards, app bar scrolled |
| 3 | FAB, dropdowns |
| 4 | FAB hovered |
| 5 | Modal dialogs |

Cards gain +2 levels on hover.

---

## Component Patterns

### App Bar
- Sticky, surface color, elevation-2
- Height: 64px
- Logo + title left, nav center (pill-shaped links), actions right
- Active nav: primary-light bg, primary text
- Hover nav: surface-container bg

### Cards
Three variants:
1. **Elevated** (default): White bg + shadow, hover increases shadow
2. **Filled**: Surface container bg, no shadow
3. **Outlined**: White bg + outline-variant border, hover adds subtle shadow

Card anatomy: media (200px) + body (16px padding) + actions (8px 16px padding)

### Buttons
All buttons are pill-shaped (`border-radius: 50px`):
1. **Filled**: Primary bg, white text — highest emphasis
2. **Filled Tonal**: Primary-light bg, primary text — medium emphasis
3. **Outlined**: Transparent bg, outline border, primary text — lower emphasis
4. **Text**: No bg/border, primary text — lowest emphasis

Padding: 10px 24px. Font: 14px, weight 500, letter-spacing 0.1px.

### Floating Action Button (FAB)
- Large: 96px, radius 28px
- Default: 56px, radius 16px
- Small: 40px, radius 12px
- Extended: auto width, 56px height, includes icon + text
- Color: primary-light bg, primary icon/text
- Shadow: elevation-3, hover elevation-4

### Chips
- Rounded rectangle (8px radius)
- Outline border by default
- Selected: primary-light bg, no border, primary text
- Font: 13px, weight 500
- Padding: 6px 16px

### Text Fields
Two variants:
1. **Outlined**: Transparent bg, outline border, 4px radius
2. **Filled**: Surface container bg, bottom border only, 4px top radius

Both support floating labels:
- Default: centered in field, 16px, muted color
- Focused/filled: floats to top edge, 12px, primary color, weight 500
- Helper text below: 12px, muted, 16px left padding

### List Items
- Flex row: 40px circular icon + content (title + subtitle)
- Pill hover (full radius)
- Icon container: primary-light bg, primary color
- Padding: 12px 16px

### Badges
- Pill shape (50px radius)
- Small: 6px dot
- Default: min-height 20px, 0 8px padding
- Colors: error (default), primary, secondary

### Snackbar
- Dark bg (#323232), white text
- 4px radius, elevation-3
- Action button: secondary color, no bg/border

### Switch
- 52x32px track, 24px circle thumb
- Off: surface-variant track, outline circle
- On: primary track, white circle
- 2px border on track

---

## Transitions

Use `0.2s cubic-bezier(0.2, 0, 0, 1)` — the Material standard easing.

---

## Overline Pattern

Section headers use an overline:
```
MATERIAL DESIGN 3        ← 12px, weight 500, uppercase, primary color, 0.5px spacing
Design with purpose      ← 28px, weight 500, text color
```

---

## General Rules

1. **500 not 700.** Headings use medium weight (500), not bold.
2. **Pill everything interactive.** Buttons, nav items, and badges all get full rounding.
3. **Letter spacing matters.** Follow the type scale precisely — different styles have different tracking.
4. **Elevation = importance.** Higher shadow = more prominent.
5. **Color sparingly.** Primary purple appears on active states, CTAs, and accents. Most UI is neutral.
6. **Surface layering.** Use the surface color scale (surface > container > container-high) for nesting depth.
7. **12px radius for cards.** Not more, not less. It is the Material standard.
8. **Tonal over outlined.** Prefer filled-tonal buttons over outlined when in doubt.
