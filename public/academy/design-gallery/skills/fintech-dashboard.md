# Fintech Dashboard Design System

> Directive for Claude: When building with this design system, follow these specifications exactly.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ft-bg` | `#0f1923` | Main background |
| `--ft-bg-secondary` | `#162130` | Sidebar, secondary areas |
| `--ft-card` | `#1e2e3d` | Cards, panels, top nav |
| `--ft-card-hover` | `#243648` | Card hover state |
| `--ft-border` | `#2a3f52` | Borders, dividers |
| `--ft-border-light` | `#354d63` | Hover borders |
| `--ft-primary` | `#2c7be5` | Primary actions, links, active states |
| `--ft-primary-hover` | `#1a68d1` | Primary hover |
| `--ft-primary-muted` | `rgba(44,123,229,0.15)` | Primary backgrounds |
| `--ft-success` | `#00d97e` | Positive values, completed status |
| `--ft-success-muted` | `rgba(0,217,126,0.12)` | Success backgrounds |
| `--ft-danger` | `#e63757` | Negative values, errors, failed status |
| `--ft-danger-muted` | `rgba(230,55,87,0.12)` | Danger backgrounds |
| `--ft-warning` | `#f6c343` | Warnings, pending status |
| `--ft-info` | `#39afd1` | Informational badges |
| `--ft-text` | `#e3ebf6` | Primary text |
| `--ft-text-secondary` | `#93a5be` | Secondary text, descriptions |
| `--ft-text-muted` | `#6b7f99` | Muted labels, placeholders |

## Typography

- **Font Family**: `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Monospace**: `'SF Mono', 'Cascadia Code', 'Fira Code', 'Consolas', monospace` for financial data
- **Base Size**: `14px`
- **Number Display**: Always use `font-variant-numeric: tabular-nums` for financial figures to ensure alignment
- **Letter Spacing**: `-0.02em` on large values, `0.04em-0.08em` on uppercase labels

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Page title | `1.5rem` | 700 | `--ft-text` |
| Card title / Section title | `1rem` | 600 | `--ft-text` |
| KPI value | `1.75rem` | 700 | `--ft-text` |
| Body text | `0.875rem` | 400 | `--ft-text` |
| Table text | `0.875rem` | 400 | `--ft-text` |
| Small label | `0.8rem` | 500 | `--ft-text-muted` |
| Tiny label (uppercase) | `0.65-0.7rem` | 600-700 | `--ft-text-muted` |
| Badge text | `0.72rem` | 600 | varies |

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
| Small elements (tabs, badges) | `4px` |
| Default (inputs, buttons) | `8px` |
| Cards, panels | `12px` |
| Pill badges | `100px` |

## Shadows

- **Default**: `0 1px 3px rgba(0, 0, 0, 0.3)`
- **Large (hover)**: `0 4px 16px rgba(0, 0, 0, 0.4)`

## Component Patterns

### Layout
- Use CSS Grid for the main layout: `grid-template-columns: 240px 1fr; grid-template-rows: 56px 1fr`
- Top nav spans full width, sidebar beneath it
- Main content area has `24px` padding and scrolls independently

### Top Navigation
- Height: `56px`, background: `--ft-card`, bottom border: `1px solid --ft-border`
- Brand: icon (28px square, `--ft-primary` bg, `6px` radius) + text
- Search: dark input inside nav, `280px` wide, `--ft-bg` background
- User menu: avatar circle (32px, `--ft-primary` bg) + name + chevron

### Sidebar
- Width: `240px`, background: `--ft-bg-secondary`, right border
- Sections with uppercase tiny title labels
- Items: `8px 24px` padding, `3px` left border (transparent default, `--ft-primary` when active)
- Active item: blue left border + primary-muted background + primary text color
- Icons: `18px`, inline SVG or icon font

### KPI Cards
- Grid: `repeat(auto-fit, minmax(220px, 1fr))`, `16px` gap
- Card: `--ft-card` bg, `1px` border, `12px` radius, `24px` padding
- Structure: header (label + icon) / value (large) / change indicator (up=green, down=red)
- Icon containers: `32px` square, `8px` radius, colored muted backgrounds
- Hover: lighter border + large shadow

### Data Tables
- Container: card with header (title + filters) and borderless table
- Headers: uppercase tiny text, dark row background, muted color
- Cells: `12px 24px` padding, bottom border
- Amount column: tabular-nums, green for positive, red for negative
- Status: pill badges with dot + text

### Status Badges
- Pill shape: `3px 10px` padding, `100px` radius
- Colored muted background + matching text color
- Optional dot: `6px` circle, `currentColor`
- Variants: success (green), danger (red), warning (yellow), info (cyan)

### Buttons
- Primary: `--ft-primary` bg, white text, `8px 16px` padding, `8px` radius
- Ghost: transparent bg, secondary text, `1px` border
- Small variant: `5px 10px`, smaller text

### Inputs
- Background: `--ft-bg`, `1px` border `--ft-border`, `8px` radius
- Focus: primary border + `0 0 0 3px primary-muted` shadow
- Select: custom arrow via SVG data URL

### Charts
- Container: card with header (title + tab switcher)
- Tab switcher: pill group with active tab highlighted in primary
- Bar charts: flex layout, `3px` top radius, primary color with varying opacity
- Donut: `conic-gradient` with inner circle cutout

## Responsive Breakpoints

- `1024px`: Chart section stacks to single column
- `768px`: Sidebar hidden, KPIs to 2 columns, search hidden
- `480px`: KPIs to single column

## Design Principles

1. **Data density**: Pack information efficiently without clutter
2. **Financial precision**: Always use tabular-nums, show currency symbols, proper decimal alignment
3. **Status at a glance**: Green = good/up, Red = bad/down, Yellow = pending, Blue = neutral/info
4. **Professional tone**: Muted palette, subtle interactions, no flashy animations
5. **Hierarchy**: KPIs at top, charts in middle, detail tables at bottom
