# Apple Minimal Design System

> Use this design system to build clean, spacious interfaces inspired by Apple's product pages. The core philosophy is **extreme whitespace, typographic hierarchy, and restrained color use**.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#ffffff` | Primary background |
| Background Secondary | `#f5f5f7` | Cards, sections, subtle fills |
| Text Primary | `#1d1d1f` | Headlines, body text |
| Text Secondary | `#6e6e73` | Subheadings, descriptions, captions |
| Accent | `#0071e3` | CTAs, links, interactive elements |
| Accent Hover | `#0077ed` | Button hover state |
| Border | `#d2d2d7` | Subtle dividers, input borders |
| Shadow | `rgba(0, 0, 0, 0.04)` | Card resting shadow |
| Shadow Hover | `rgba(0, 0, 0, 0.08)` | Card hover shadow |

When building with this design system, use **only the accent blue for interactive elements**. All other elements should be grayscale. Color should be minimal and purposeful.

---

## Typography

- **Font Stack**: `-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif`
- **Smoothing**: Always use `-webkit-font-smoothing: antialiased`

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| Headline 1 | 56px | 600 | 1.07 | -0.005em |
| Headline 2 | 48px | 600 | 1.08 | -0.003em |
| Headline 3 | 28px | 600 | 1.14 | 0.007em |
| Subhead | 21px | 400 | 1.38 | 0.011em |
| Body | 17px | 400 | 1.47 | -0.022em |
| Caption | 12px | 400 | 1.33 | -0.01em |
| Eyebrow | 12px | 600 | 1.33 | -0.01em, uppercase |

When building with this design system, use **large, bold headlines** as the focal point of each section. Subheadings should always be in the secondary gray color.

---

## Spacing

- **Hero padding**: 80px top, 60px bottom
- **Section padding**: 80px vertical
- **Card padding**: 40px (28px on mobile)
- **Grid gap**: 20px
- **Max content width**: 980px (wide: 1200px)
- **Navigation height**: 52px
- **Edge padding**: 22px minimum on all sides

When building with this design system, **use generous whitespace**. Content should breathe. Sections should feel distinct through spacing alone, not through heavy borders or backgrounds.

---

## Border Radius

| Element | Radius |
|---------|--------|
| Buttons (pill) | 980px (fully rounded) |
| Cards | 18px |
| Inputs | 12px |
| Small elements | 8px |
| Icons | 12px-14px |

---

## Shadows

- **Card default**: `0 2px 12px rgba(0, 0, 0, 0.04)`
- **Card hover**: `0 4px 24px rgba(0, 0, 0, 0.08)` with `translateY(-2px)`
- **No heavy drop shadows** -- subtlety is key

---

## Component Patterns

### Navigation
- Sticky top bar with frosted glass: `background: rgba(255,255,255,0.72)`, `backdrop-filter: saturate(180%) blur(20px)`
- Height: 52px, with thin bottom border
- Logo left, links center/right, CTA button far right

### Buttons
- **Primary**: Pill-shaped (`border-radius: 980px`), solid blue background, white text
- **Secondary**: Text-only with blue color, no background, hover underline
- **Outline**: Pill-shaped with blue border, transparent background, fills on hover
- Padding: 12px 28px standard, 8px 20px small, 16px 36px large

### Cards
- White background with subtle shadow, or `#f5f5f7` secondary background with no shadow
- 18px border radius
- Hover: lift with enhanced shadow
- Center-aligned content for feature cards

### Hero Sections
- Center-aligned with eyebrow text (uppercase, accent color)
- Large headline, lighter subhead below
- Max subhead width: ~600px
- CTAs in a horizontal row

### Inputs
- 12px radius, 1px border in `#d2d2d7`
- Focus: blue border + blue glow ring (`0 0 0 4px rgba(0,113,227,0.12)`)
- Clean placeholder in secondary gray

### Badges
- Pill-shaped (`border-radius: 980px`)
- Light tinted backgrounds (10% opacity of the badge color)
- Small text (12px), medium weight

---

## Responsive Behavior

- At `max-width: 767px`:
  - Headlines scale down significantly (56px -> 32px)
  - Grids collapse to single column
  - Navigation links hide (hamburger expected)
  - Cards reduce padding to 28px
  - Sections reduce to 48px vertical padding

---

## Key Principles

1. **Less is more** -- every pixel must earn its place
2. **Typography drives hierarchy** -- not color, not icons
3. **Whitespace is a feature** -- never crowd content
4. **Animations are subtle** -- smooth ease curves, small transforms
5. **Consistency over cleverness** -- repeat proven patterns
