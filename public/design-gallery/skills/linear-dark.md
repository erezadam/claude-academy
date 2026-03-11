# Linear Dark Design System

> Use this design system to build ultra-dark productivity interfaces with sidebar navigation, issue lists, and status-driven UI. The core philosophy is **density without clutter, dark surfaces with subtle borders, and a tool-first aesthetic**.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0e0e10` | Main app background |
| Surface | `#1a1a2e` | Cards, sidebar hover, elevated elements |
| Surface Hover | `#1f1f36` | Hovered surfaces |
| Border | `#2a2a3e` | All borders, dividers, separators |
| Border Hover | `#3a3a52` | Hovered border state |
| Accent | `#5e6ad2` | Primary interactive, active states, progress bars |
| Accent Hover | `#6e7ae2` | Accent hover state |
| Accent Subtle | `rgba(94, 106, 210, 0.12)` | Active item backgrounds, accent badges |
| Text Primary | `#e8e8ed` | Headlines, primary content |
| Text Secondary | `#8a8a9a` | Body text, secondary labels |
| Text Tertiary | `#5a5a6e` | Captions, placeholders, disabled text |
| Success | `#4dba87` | Done status, completion |
| Warning | `#f0c000` | In-progress status, caution |
| Danger | `#e5484d` | Bugs, urgent, errors |
| Info | `#52a8ff` | Information, infrastructure |

When building with this design system, **borders are the primary way to separate surfaces**, not shadows. Backgrounds are very close in value -- differentiation is subtle and intentional.

---

## Typography

- **Font Stack**: `-apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", system-ui, sans-serif`
- **Monospace**: `"SF Mono", "Fira Code", "Fira Mono", Menlo, Consolas, monospace`

| Level | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| H1 | 32px | 500 | 1.2 | -0.03em |
| H2 | 22px | 500 | 1.25 | -0.02em |
| H3 | 16px | 500 | 1.4 | -0.01em |
| Body | 14px | 400 | 1.5 | 0 |
| Caption | 12px | 400 | 1.4 | 0 |
| Mono | 13px | 400 | 1.5 | 0 |

When building with this design system, use **medium weight (500) for headings, not bold**. The overall feel should be confident but understated. Body text should always be 14px -- this is a dense, tool-first interface.

---

## Layout: Sidebar + Content

The primary layout is a sidebar with a main content area:

- **Sidebar width**: 240px, fixed position
- **Sidebar background**: Same as main background (`#0e0e10`) with a right border
- **Main content**: Fluid, with `margin-left: 240px`
- **Top bar**: 48px height, sticky, border bottom

When building with this design system, **the sidebar is always present on desktop**. It contains the logo, search, primary navigation, sections separated by dividers, and team indicators with colored dots.

---

## Spacing

- **Content padding**: 24px
- **List item padding**: 10px 16px
- **Card padding**: 20px
- **Grid gap**: 16px
- **Sidebar item padding**: 6px 16px
- **Button padding**: 6px 12px (compact by default)

---

## Border Radius

| Element | Radius |
|---------|--------|
| Cards | 8px |
| Buttons | 6px |
| Inputs | 6px |
| Badges | 6px |
| Sidebar logo | 4px |
| Status dots | 50% (circle) |
| Avatars | 50% (circle) |

---

## Shadows

- **No shadows used.** This design system relies entirely on **borders** (`#2a2a3e`) for element separation. The ultra-dark background makes shadows invisible, so borders are the correct tool.

---

## Component Patterns

### Sidebar Navigation
- Fixed left, full height, border-right in `#2a2a3e`
- Logo: small colored square + workspace name
- Items: icon + label, 14px, secondary gray. Active: accent subtle background
- Sections separated by horizontal dividers
- Team section with colored dots (one color per team)
- Footer: user avatar + name

### Top Bar
- Sticky, 48px, border-bottom
- Left: breadcrumb path with separator slashes
- Right: filter button, group button, primary action button

### Issue List
- Container with border and 8px radius
- Each row: priority icon | status dot | ID (monospace) | title | badges | avatar
- Row hover: surface background
- 1px bottom border between rows
- Completed items: strikethrough text in secondary color

### Status Badges
- 6px radius, 2px 8px padding
- Tinted backgrounds at 12% opacity of the status color
- Variants: accent (purple), success (green), warning (yellow), danger (red), info (blue), neutral (gray)

### Status Dots
- 8px circle, solid color fill
- Backlog: tertiary gray, Todo: secondary gray, Progress: warning yellow, Done: success green, Cancelled: danger red

### Priority Indicators
- Urgent: `!` in danger red
- High: `!!` in orange (#f76808)
- Medium: up triangle in warning yellow
- Low: down triangle in info blue

### Buttons
- **Primary**: accent background, white text, 6px radius. Compact sizing (6px 12px)
- **Secondary**: surface background with border
- **Ghost**: transparent, secondary text, no border
- **Icon button**: square (32x32), ghost style
- All buttons are small by default -- this is a dense UI

### Cards
- Surface background (`#1a1a2e`), 1px border, 8px radius
- Hover: border lightens to `#3a3a52`
- No shadow -- ever

### Inputs
- Surface background, 1px border, 6px radius
- Focus: accent border + accent subtle ring (`0 0 0 2px`)
- Placeholder: tertiary gray

### Progress Bars
- 4px height, rounded, border color for track
- Accent fill by default, status colors for specific states

### Avatars
- Circle, 24px default, 20px small
- Accent background with white initials
- Custom colors per team member

---

## Responsive Behavior

- At `max-width: 767px`:
  - Sidebar hides completely
  - Main content fills full width
  - Grids collapse to single column
  - H1: 24px, H2: 18px

---

## Key Principles

1. **Density is a feature** -- pack information efficiently without feeling cramped
2. **Borders, not shadows** -- on dark backgrounds, borders are the correct affordance
3. **Status colors tell the story** -- green/yellow/red/blue convey state at a glance
4. **Monospace for IDs** -- issue IDs, commit hashes, and codes use monospace
5. **Subtlety in interactions** -- hover states are gentle shifts, not dramatic changes
6. **Keyboard-first design** -- show shortcuts, support command palette patterns
