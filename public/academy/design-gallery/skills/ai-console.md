# AI Console Design System

> Directive for Claude: When building with this design system, follow these specifications exactly.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--ai-bg` | `#0c0c14` | Main background, deepest layer |
| `--ai-bg-secondary` | `#101020` | Sidebar, input area |
| `--ai-panel` | `#1a1a2e` | Panels, cards, message bodies |
| `--ai-panel-hover` | `#20203a` | Panel hover state |
| `--ai-border` | `#333` | All borders |
| `--ai-border-light` | `#444` | Hover borders |
| `--ai-green` | `#00ff41` | Matrix green - primary accent, online status, assistant label |
| `--ai-green-dim` | `#00cc34` | Dimmed green |
| `--ai-green-muted` | `rgba(0,255,65,0.1)` | Green backgrounds |
| `--ai-purple` | `#7b68ee` | Model name, code labels, user-related accents |
| `--ai-purple-muted` | `rgba(123,104,238,0.12)` | Purple backgrounds |
| `--ai-cyan` | `#00d4ff` | Token counts, cost values, links |
| `--ai-cyan-muted` | `rgba(0,212,255,0.1)` | Cyan backgrounds |
| `--ai-red` | `#ff3366` | Errors |
| `--ai-yellow` | `#ffcc00` | Warnings |
| `--ai-text` | `#c8c8d4` | Default text |
| `--ai-text-bright` | `#e8e8f0` | Emphasized text |
| `--ai-text-muted` | `#666680` | Muted labels, placeholders |

## Typography

- **Primary Font**: `'JetBrains Mono', 'Fira Code', 'SF Mono', 'Consolas', monospace` - used EVERYWHERE
- **Sans fallback**: `system-ui, -apple-system, sans-serif` - rarely used, only for specific UI elements
- **Base Size**: `14px`
- **Everything is monospace**: This is a terminal-inspired design. All text uses the monospace font.

### Type Scale

| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Brand text | `0.95rem` | 700 | `--ai-green` |
| Message body | `0.875rem` | 400 | `--ai-text` |
| Code blocks | `0.8rem` | 400 | `--ai-green` |
| Labels (uppercase) | `0.65-0.7rem` | 600 | `--ai-text-muted` |
| Parameters | `0.78rem` | 400/600 | muted label / cyan value |
| Badge text | `0.68rem` | 600 | varies |
| Input placeholder | `0.875rem` | 400 | `--ai-text-muted` |
| Sidebar items | `0.8rem` | 400 | `--ai-text-muted` / `--ai-green` active |

## Spacing

| Token | Value |
|-------|-------|
| `xs` | `4px` |
| `sm` | `8px` |
| `md` | `16px` |
| `lg` | `24px` |
| `xl` | `32px` |

## Border Radius

| Usage | Value |
|-------|-------|
| Default (most elements) | `4px` |
| Panels, messages | `8px` |
| Larger cards | `12px` |

Keep radius small - this is a terminal aesthetic. Nothing should be rounded like a pill.

## Shadows

- **Default**: `0 2px 8px rgba(0, 0, 0, 0.5)`
- **Green glow**: `0 0 20px rgba(0, 255, 65, 0.1)` - used on green elements
- **Purple glow**: `0 0 20px rgba(123, 104, 238, 0.15)` - used on purple elements

## Special Effects

### Scanlines
Apply a subtle scanline overlay across the entire viewport:
```css
background: repeating-linear-gradient(
  0deg,
  transparent, transparent 2px,
  rgba(0, 0, 0, 0.03) 2px,
  rgba(0, 0, 0, 0.03) 4px
);
```
Use `pointer-events: none` and high `z-index`.

### Blinking Cursor
```css
animation: blink 1s step-end infinite;
@keyframes blink { 50% { opacity: 0; } }
```
Apply to: brand cursor element, active input cursor indicators.

### Typing Indicator
Three dots with staggered pulse animation:
- `6px` circles, green color
- `animation: pulse 1.4s infinite` with `0.2s` delay between dots
- Pulse: scale 0.8 + opacity 0.2 to scale 1 + opacity 1

## Component Patterns

### Layout
- CSS Grid: `260px 1fr 300px` columns, `48px 1fr` rows
- Three-panel layout: sidebar / chat / right panel
- Full viewport height, no scroll on outer container

### Top Bar
- Height: `48px`, `--ai-panel` bg, bottom border
- Left: brand with blinking cursor block + monospace text in green
- Center: model selector (dark pill with green dot + purple text) + token counter
- Right: status badge + settings button

### Left Sidebar (Conversations)
- `260px` wide, `--ai-bg-secondary` bg
- New session button: green-muted bg, green text, green border, full width
- Conversation list with date headers (tiny uppercase muted text)
- Active item: panel bg, green text, subtle green border
- Items show truncated text with `text-overflow: ellipsis`

### Chat Messages
- Messages flow top to bottom with `24px` gap
- User messages: right-aligned, max-width `85%`, purple-muted border
- Assistant messages: left-aligned, panel bg, default border
- Message labels: tiny uppercase text (user=cyan "user@local ~$", assistant=green "[neural_console]")

### Code Blocks in Messages
- Background: `rgba(0,0,0,0.4)`, border, `4px` radius
- Header: filename + language label, bottom border
- Code in green color
- Syntax highlighting follows terminal color scheme

### Input Area
- Bottom of chat, `--ai-bg-secondary` bg, top border
- Wrapper: panel bg, border, `8px` radius, flex layout
- Textarea: no border, monospace, auto-resize
- Send button: `36px` square, green bg, dark text
- Command shortcuts below (`/help`, `/clear`, `/export`)

### Right Panel
- `300px` wide, `--ai-bg-secondary` bg
- Sections: system prompt textarea, model parameters, response info, session stats
- System prompt: dark textarea with monospace font, resizable
- Parameters: label-value pairs, labels muted, values in cyan
- Response info: tabular layout, latency in green, cost in cyan

### Buttons
- Green: green-muted bg, green text, green border
- Purple: purple-muted bg, purple text, purple border
- Ghost: transparent, muted text, default border

### Badges
- Small: `2px 8px` padding, `4px` radius, monospace
- Green (online/success), purple (model/category), cyan (stats)

## Responsive Breakpoints

- `1024px`: Hide both sidebars, show only chat

## Design Principles

1. **Terminal aesthetic**: Everything looks like it could be output from a CLI
2. **Monospace everywhere**: Consistency through the single font family
3. **Matrix green**: The signature color - used for AI responses, active states, success
4. **Purple for user context**: User messages, model names, code labels
5. **Cyan for data**: Token counts, costs, metrics
6. **Dark and deep**: Multiple layers of dark (bg < bg-secondary < panel) create depth
7. **Subtle sci-fi**: Scanlines, blinking cursors, and typing indicators add atmosphere without being distracting
8. **Functional density**: Right panel shows all model parameters and response metrics at a glance
