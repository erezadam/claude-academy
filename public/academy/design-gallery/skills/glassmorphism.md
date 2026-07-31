# Glassmorphism Design System — Skill Prompt

> Use this as a directive when building UI with the Glassmorphism style.

---

## Overview

When building with this design system, create **translucent, frosted-glass interfaces** over vibrant gradient backgrounds. The aesthetic relies on `backdrop-filter: blur()`, semi-transparent white surfaces, and soft rounded shapes. The result should feel modern, premium, and airy — like floating glass panels over a colorful canvas.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Gradient Start | `#667eea` | Left/top of main background gradient |
| Gradient End | `#764ba2` | Right/bottom of main background gradient |
| Alt Gradient Start | `#f093fb` | Accent gradient (CTAs, avatars, FAB) |
| Alt Gradient End | `#f5576c` | Accent gradient end |
| Cool Gradient Start | `#4facfe` | Optional secondary gradient |
| Cool Gradient End | `#00f2fe` | Optional secondary gradient end |
| Glass Surface | `rgba(255, 255, 255, 0.15)` | Standard glass panel fill |
| Glass Strong | `rgba(255, 255, 255, 0.25)` | Elevated/prominent glass |
| Glass Subtle | `rgba(255, 255, 255, 0.08)` | Inputs, subtle surfaces |
| Glass Border | `rgba(255, 255, 255, 0.2)` | Standard glass edge |
| Glass Border Strong | `rgba(255, 255, 255, 0.35)` | Focus, emphasized edges |
| Text | `#ffffff` | Primary text |
| Text Secondary | `rgba(255, 255, 255, 0.8)` | Body text, descriptions |
| Text Muted | `rgba(255, 255, 255, 0.5)` | Labels, placeholders |

### Badge Colors
- Success: `rgba(72, 255, 167, 0.2)` bg / `rgba(72, 255, 167, 0.3)` border
- Warning: `rgba(255, 200, 55, 0.2)` bg / `rgba(255, 200, 55, 0.3)` border
- Error: `rgba(255, 90, 120, 0.2)` bg / `rgba(255, 90, 120, 0.3)` border

---

## The Glass Effect

Every glass surface must have these three properties:

```css
background: rgba(255, 255, 255, 0.15);
backdrop-filter: blur(20px);
-webkit-backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
```

**Blur levels:**
- Standard: `blur(20px)` — cards, panels
- Strong: `blur(30px)` — nav bar (needs extra clarity)
- Subtle: `blur(12px)` — inputs, small elements

**Important:** The glass effect only works when there is a colorful background behind it. Always ensure body has a gradient background with `background-attachment: fixed`.

---

## Background Setup

The page background is critical. Always include:

```css
body {
  background: linear-gradient(135deg, #667eea, #764ba2);
  background-attachment: fixed;
  min-height: 100vh;
}
```

Add floating colored blobs using `::before` and `::after` pseudo-elements:
```css
body::before {
  content: '';
  position: fixed;
  top: -20%; right: -10%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.3), transparent 70%);
  border-radius: 50%;
  pointer-events: none;
}
```

---

## Typography

- **Font:** 'Poppins', system-ui, sans-serif
- **Weights:** 300 (light/descriptions), 400 (body), 500 (labels), 600 (headings), 700 (hero/stats)
- **H1:** 48px, weight 700, letter-spacing -0.02em
- **H2:** 32px, weight 600
- **H3:** 22px, weight 600
- **Body:** 16px, line-height 1.6
- **All text is white** — differentiate with opacity levels, not color changes

---

## Spacing

- Card padding: 28px
- Section margins: 56px between sections
- Grid gaps: 24px for cards, 16px for stats
- Container max-width: 1200px

---

## Border Radius

- Standard (cards, inputs): `16px`
- Large (pricing, hero elements): `24px`
- Full (buttons, badges, FAB): `50px` — pill shapes
- Icon containers: `12px`

---

## Shadows

```css
/* Standard */
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

/* Elevated / hover */
box-shadow: 0 16px 48px rgba(0, 0, 0, 0.18);

/* Glow (for gradient elements) */
box-shadow: 0 4px 20px rgba(240, 147, 251, 0.4);
```

---

## Component Patterns

### Navigation Bar
- Sticky with 16px top offset (floats slightly below top)
- Glass surface with strong blur (30px)
- Border-radius 16px
- Logo left, links center, action buttons right
- Links: 14px, weight 500, secondary text color, hover to white

### Glass Cards
- Standard glass surface + border + blur
- 28px padding, 16px radius
- Hover: translateY(-4px) + larger shadow
- Card grid: auto-fit, minmax(280px, 1fr)
- Icon container: 48px square, stronger glass bg, 12px radius

### Profile Card
- Centered layout
- Avatar: 88px circle with gradient background + glow shadow
- Stats row: flex with 32px gap, value 24px bold, label 12px muted

### Stat Cards
- Grid: auto-fit, minmax(160px, 1fr)
- Centered text, 24px padding
- Value: 32px, weight 700
- Label: 13px, muted

### Buttons
- Pill shape (border-radius: 50px)
- Glass: transparent glass bg + glass border
- Filled: white bg, gradient-start text color
- Gradient: pink-to-red gradient, white text, glow shadow on hover
- Sizes: sm (6px 16px), default (10px 24px), lg (14px 32px)
- Hover: slight translateY(-1px) + shadow increase

### Floating Action Button
- Fixed bottom-right (32px offset)
- 56px circle, gradient fill
- Glow shadow, scale(1.1) on hover

### Form Inputs
- Subtle glass bg (0.08 opacity) + glass border
- 16px radius, 12px 18px padding
- Focus: stronger border + 3px white glow ring
- Labels: 13px, weight 500, secondary color

### Badges
- Full pill shape, glass bg
- Success/warning/error variants with tinted backgrounds
- 12px font, 4px 12px padding

### Tables
- Collapsed, full-width
- Header: 12px uppercase, muted color, glass border bottom
- Cells: subtle bottom border (white 6% opacity)
- Row hover: white 5% background

---

## Transitions

Use `0.3s cubic-bezier(0.4, 0, 0.2, 1)` for all transitions. Common effects:
- Card hover: translateY(-4px) + shadow increase
- Button hover: translateY(-1px) + shadow
- FAB hover: scale(1.1)
- Focus states: border-color + glow ring

---

## General Rules

1. **Always have a gradient background.** The glass effect is meaningless without it.
2. **Use white at different opacities** for all UI — never introduce new hue colors for surfaces.
3. **Blur is mandatory.** Every glass surface needs `backdrop-filter: blur()`.
4. **Include `-webkit-` prefix** for backdrop-filter (Safari support).
5. **Pill shapes for interactive elements.** Buttons, badges, and inputs get fully rounded or 16px+ radius.
6. **Soft, floaty feel.** Use translateY hover effects. No hard edges or sharp transitions.
7. **Add floating blobs.** Background should have at least 2-3 semi-transparent radial gradients for depth.
8. **Light font weight for descriptions.** Use 300 weight for supporting text to maintain the airy feel.
