# Stripe SaaS Design System

> Use this design system to build professional, polished SaaS interfaces with dark gradient backgrounds and clean white cards. The core philosophy is **dark elegance meets bright clarity, with gradient accents that signal premium quality**.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background Dark | `#0a2540` | Primary page background |
| Background Darker | `#061b30` | Deeper sections |
| Primary Purple | `#635bff` | CTAs, featured elements, active states |
| Primary Hover | `#7a73ff` | Button hover |
| Teal Accent | `#00d4aa` | Success states, secondary CTAs, checkmarks |
| White | `#ffffff` | Cards, light sections, primary text on dark |
| Text Light | `#adbdcc` | Body text on dark backgrounds |
| Text Dark | `#0a2540` | Text on white cards |
| Text Muted | `#425466` | Secondary text on white cards |
| Border Dark | `rgba(255, 255, 255, 0.1)` | Borders on dark backgrounds |
| Border Light | `#e6e9ec` | Borders on white cards |

When building with this design system, the **dark navy background is always the default**. White is used for cards and light content sections that float above it. Purple and teal are accent colors -- never use them for large areas.

---

## Typography

- **Font Stack**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Smoothing**: Always use `-webkit-font-smoothing: antialiased`

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| H1 | 64px | 700 | 1.1 | -0.03em |
| H2 | 44px | 700 | 1.15 | -0.02em |
| H3 | 24px | 600 | 1.3 | -0.01em |
| H4 | 18px | 600 | 1.4 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Caption | 13px | 400 | 1.5 | 0.02em |
| Overline | 13px | 700 | 1.5 | 0.1em, uppercase |

When building with this design system, use **bold, confident headings** at large sizes. The overline style (small, uppercase, letterspaced) is essential for labeling sections.

---

## Gradient Patterns

- **Hero gradient**: `linear-gradient(135deg, #0a2540 0%, #1a1f71 50%, #0a2540 100%)`
- **Accent gradient**: `linear-gradient(135deg, #635bff, #00d4aa)` -- used for gradient text and decorative elements
- **Grid pattern**: Subtle grid overlay using `rgba(255,255,255,0.03)` lines at 60px intervals
- **Glow orbs**: Large blurred circles (`filter: blur(120px)`) of purple and teal at low opacity for ambient atmosphere

When building with this design system, **always include background visual interest** -- grid patterns, subtle gradients, or glow effects. The background should never be flat.

---

## Spacing

- **Hero padding**: 100px top, 80px bottom
- **Section padding**: 100px vertical
- **Card padding**: 36px (24px on mobile)
- **Grid gap**: 24px
- **Max content width**: 1200px
- **Navigation height**: 64px

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons | 100px (pill) |
| Cards | 16px |
| Inputs | 8px |
| Badges | 100px (pill) |
| Feature icons | 12px |

---

## Shadows

- **Card default**: `0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)`
- **Card hover**: `0 15px 35px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.12)`
- **Purple button hover glow**: `0 4px 12px rgba(99,91,255,0.4)`

---

## Component Patterns

### Navigation
- Sticky with backdrop blur: `background: rgba(10,37,64,0.85)`, `backdrop-filter: blur(16px)`
- Height: 64px, thin bottom border
- Logo with brand color highlight span
- Sign in (outline) + Start now (primary) on the right

### Buttons
- **Primary**: Pill-shaped, purple background, white text. Hover lifts with glow shadow
- **Teal**: Pill-shaped, teal background, dark text
- **Outline**: Pill with semi-transparent white border on dark. Hover brightens border
- **White**: Solid white for use on dark, dark text
- Sizes: sm (8px 16px), default (12px 24px), lg (16px 32px)

### Cards (White on Dark)
- White background, 16px radius, generous padding
- Distinct shadow for depth against the dark background
- Hover: lift 4px with enhanced shadow
- **Featured**: 2px purple border + floating badge with `position: absolute; top: -12px`

### Dark Cards
- `rgba(255,255,255,0.05)` background with subtle white border
- Hover: slightly brighter background and border
- No shadow -- the border does the work

### Pricing Cards
- White cards in a 3-column grid
- Large price number (48px, 700 weight)
- Feature list with teal checkmarks
- Middle card featured with purple border and "Most Popular" badge

### Hero Sections
- Centered text on dark gradient background
- Overline label in purple above the headline
- Gradient text for emphasis (purple to teal)
- Two buttons: primary purple + outline

### Inputs
- On dark: dark transparent background with white border
- On light: white background with light gray border
- Focus: purple border + purple glow ring

### Badges
- Pill-shaped with tinted backgrounds (12% opacity of the badge color)
- Small (12px), semibold text

### Feature Icons
- 52px square, 12px radius
- Tinted background (12% opacity) with matching icon color
- Purple or teal variants

---

## Responsive Behavior

- At `max-width: 767px`:
  - H1: 36px, H2: 28px
  - Hero padding: 60px top
  - Grids collapse to single column
  - Nav links hide
  - Cards: 24px padding
  - Footer stacks vertically

---

## Key Principles

1. **Contrast creates hierarchy** -- white cards pop against dark backgrounds
2. **Gradients signal premium** -- use them for hero backgrounds and text highlights
3. **Purple is primary, teal is secondary** -- never mix their roles
4. **Professional spacing** -- generous padding communicates confidence
5. **Subtle motion** -- cards lift on hover, buttons glow, transitions are fast (0.2s)
