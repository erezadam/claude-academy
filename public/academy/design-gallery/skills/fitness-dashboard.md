# Fitness Dashboard Design System

> Directive for Claude: When building with this design system, follow these specifications exactly.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--fit-bg` | `#1a1a2e` | Main background |
| `--fit-bg-secondary` | `#16162a` | Deeper background areas |
| `--fit-card` | `#2d2d44` | Card backgrounds |
| `--fit-card-hover` | `#353550` | Card hover state |
| `--fit-border` | `#3d3d5c` | Borders |
| `--fit-primary` | `#ff6b35` | Orange primary accent |
| `--fit-primary-hover` | `#ff5519` | Orange hover |
| `--fit-accent` | `#ffc857` | Yellow accent |
| `--fit-gradient` | `linear-gradient(135deg, #ff6b35, #ffc857)` | CTA buttons, chart bars, hero elements |
| `--fit-success` | `#27c93f` | Success, completed |
| `--fit-danger` | `#ff3b5c` | Errors |
| `--fit-info` | `#5b8def` | Informational |
| `--fit-text` | `#f0f0f8` | Primary text |
| `--fit-text-secondary` | `#a0a0be` | Secondary text |
| `--fit-text-muted` | `#6e6e8a` | Muted labels |

## Typography

- **Headings**: Bold condensed font. Use `'Impact', 'Arial Narrow', system-ui, sans-serif` or a similar bold condensed typeface
- **Body**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Base Size**: `15px`
- **Stat Values**: `font-weight: 800`, `letter-spacing: -0.03em`, `font-variant-numeric: tabular-nums`

### Type Scale

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| User name / Page title | `1.4rem` | 800 | `letter-spacing: -0.02em` |
| Section title | `1.1rem` | 700 | |
| Stat value | `2rem` | 800 | Tabular nums |
| Progress ring value | `1.5rem` | 800 | |
| Body / Activity name | `0.9rem` | 600 | |
| Label (uppercase) | `0.78rem` | 600 | `text-transform: uppercase; letter-spacing: 0.06em` |
| Badge text | `0.72rem` | 700 | Uppercase |
| Detail text | `0.78rem` | 400 | Muted color |

## Spacing

| Token | Value |
|-------|-------|
| `xs` | `4px` |
| `sm` | `8px` |
| `md` | `16px` |
| `lg` | `24px` |
| `xl` | `32px` |
| `2xl` | `48px` |

## Border Radius

| Usage | Value |
|-------|-------|
| Small (stat icons) | `8px` |
| Default (cards) | `16px` |
| Large (sections) | `20px` |
| Pill (buttons, badges, inputs) | `100px` |

## Shadows

- **Default**: `0 4px 12px rgba(0, 0, 0, 0.3)`
- **Large**: `0 8px 32px rgba(0, 0, 0, 0.4)`
- **Glow (primary)**: `0 4px 20px rgba(255, 107, 53, 0.3)` - used on gradient CTAs

## Component Patterns

### Layout
- Single column, max-width `1200px`, centered with `24px` padding
- No sidebar - everything flows in a single scrollable view

### Profile Header
- Flexbox row: avatar + greeting/name on left, streak badge + CTA on right
- Avatar: `56px` circle with gradient background, glow shadow
- Streak: pill badge with fire emoji, card bg, border

### Workout Stats Row
- Grid: `repeat(4, 1fr)`, `16px` gap
- Each stat: centered text, icon on top (44px square, `12px` radius, colored muted bg), large number, uppercase label
- Hover: border appears + slight `translateY(-2px)` + shadow

### Progress Circles
- Grid: 3 columns, `16px` gap
- Each card: title, SVG ring, percentage, meta text
- SVG rings: `120px` diameter, `stroke-width: 8`, rotate `-90deg` for top start
- Background ring: `rgba(255,255,255,0.08)`
- Fill ring: colored with `stroke-dasharray` for percentage, `stroke-linecap: round`
- Center: absolute-positioned large percentage text

### Weekly Chart
- Card with title + navigation arrows
- Bar chart: flex row, `12px` gap, `180px` height
- Bars: full-width gradient fill, `8px 8px 4px 4px` radius
- Rest days: `--fit-border` color at `0.5` opacity
- Day labels below each bar

### Activity Feed
- Card with title + list of items
- Each item: icon (40px, `12px` radius, colored bg) + info (name + detail) + time
- Items separated by subtle bottom border

### Buttons
- **Gradient CTA**: `--fit-gradient` bg, white text, pill shape, `12px 24px` padding, uppercase, `letter-spacing: 0.04em`, glow shadow
- Hover: darker gradient + `translateY(-1px)` + larger glow
- **Outline**: transparent bg, orange text, `2px` orange border, pill shape
- **Ghost**: no bg, secondary text color

### Badges
- Pill shape: `4px 12px`, `100px` radius, `0.72rem`, `700` weight, uppercase
- Orange, yellow, green variants with 15% opacity background

### Form Inputs
- Dark background: `rgba(0,0,0,0.2)`
- `2px` border in `--fit-border`, pill shape (`100px` radius), `12px 20px` padding
- Focus: orange border + orange glow ring

## Responsive Breakpoints

- `1024px`: Content grid stacks to single column
- `768px`: Stats to 2 columns, progress rings stack, profile header centers vertically
- `480px`: Stats to single column

## Design Principles

1. **Bold & energetic**: Large numbers, bright gradients, strong contrast
2. **Motivation-driven**: Progress rings show achievement, streak tracking, badges for gamification
3. **Rounded everything**: Cards, buttons, inputs all use generous border radius
4. **Gradient as hero**: The orange-to-yellow gradient is the signature element, use it for primary CTAs and chart fills
5. **Glow effects**: Primary elements get subtle orange glow shadows
6. **Large typography**: Stat values are oversized to create visual impact
