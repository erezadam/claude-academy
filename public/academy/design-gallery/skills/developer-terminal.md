# Developer Terminal Design System

> Directive for Claude: When building with this design system, follow these specifications exactly.

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--dev-bg` | `#1e1e1e` | Editor background, main area |
| `--dev-bg-secondary` | `#252526` | Activity bar, tab bar, explorer, terminal header |
| `--dev-surface` | `#2d2d2d` | Hover surfaces, dropdowns |
| `--dev-surface-hover` | `#333333` | Deep hover |
| `--dev-border` | `#3c3c3c` | All borders and dividers |
| `--dev-border-active` | `#007acc` | Active tab indicator, focus borders |
| `--dev-accent` | `#007acc` | Status bar, active indicators, primary buttons |
| `--dev-accent-hover` | `#1c8bd6` | Accent hover |
| `--dev-text` | `#d4d4d4` | Primary text |
| `--dev-text-secondary` | `#969696` | Inactive tabs, secondary text |
| `--dev-text-muted` | `#6a6a6a` | Line numbers, disabled text |

### Syntax Highlighting Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--dev-blue` | `#569cd6` | Keywords (`import`, `const`, `class`, `if`, `return`) |
| `--dev-light-blue` | `#9cdcfe` | Variables, parameters |
| `--dev-teal` | `#4ec9b0` | Types, interfaces, classes |
| `--dev-orange` | `#ce9178` | Strings |
| `--dev-yellow` | `#dcdcaa` | Functions, method names |
| `--dev-green` | `#6a9955` | Comments |
| `--dev-purple` | `#c586c0` | Decorators, control flow (`async`, `await`) |
| `--dev-red` | `#f44747` | Errors, invalid tokens |
| `--dev-number` | `#b5cea8` | Numeric literals |

## Typography

- **Code Font**: `'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace`
- **UI Font**: `system-ui, -apple-system, 'Segoe UI', sans-serif`
- **Base Size**: `13px`
- **Code uses the code font. UI chrome (tabs, explorer, status bar) uses the UI font.**
- Enable font ligatures in the code font where supported

### Type Scale

| Element | Size | Font | Weight |
|---------|------|------|--------|
| Code | `1rem` (13px) | Code | 400 |
| Tab names | `0.92rem` | UI | 400 |
| Explorer files | `0.92rem` | UI | 400 |
| Section headers | `0.85rem` | UI | 600 |
| Terminal output | `0.92rem` | Code | 400 |
| Terminal tabs | `0.72rem` | UI | 400, uppercase |
| Status bar | `0.78rem` | UI | 400 |
| Breadcrumbs | `0.85rem` | UI | 400 |
| Activity bar badges | `0.6rem` | UI | 600 |

## Spacing

| Token | Value |
|-------|-------|
| `xs` | `2px` |
| `sm` | `4px` |
| `md` | `8px` |
| `lg` | `16px` |
| `xl` | `24px` |

Spacing is very tight in this system. It mimics IDE density.

## Border Radius

- **Default**: `3px` - used for almost everything
- **Badge**: `8px` for activity bar badges
- This system uses very minimal border radius. Nothing is rounded.

## Shadows

- **Default**: `0 2px 8px rgba(0, 0, 0, 0.4)`
- Shadows are used sparingly. The design relies on borders and background colors for separation.

## Component Patterns

### Layout
- CSS Grid: `48px 240px 1fr` columns, `35px 1fr 200px 22px` rows
- Activity bar | File explorer | Editor
- Tab bar spans explorer + editor
- Terminal panel at bottom
- Status bar across full width
- Full viewport height, no outer scroll

### Activity Bar (far left)
- Width: `48px`, `--dev-bg-secondary` bg, right border
- Icon items: `48x48px`, centered icons, muted color
- Active icon: white color + `2px` left blue border
- Badge: `16px` min-width circle, `--dev-accent` bg, white text, positioned top-right

### Tab Bar
- Height: `35px`, `--dev-bg-secondary` bg, bottom border
- Tabs: `0 16px` padding, full height, right border
- Active tab: `--dev-bg` background (matches editor), `1px` blue top border, white text
- Inactive tab: secondary bg, muted text
- Close button: `16px` square, appears on hover
- File type icon before name: colored based on language

### File Explorer
- Width: `240px`, `--dev-bg-secondary` bg, right border
- Header: uppercase small text with "EXPLORER" label
- Section titles: with expand/collapse arrow
- Files: icon + name, `2px` vertical padding, indent levels via padding-left
- Active file: `rgba(0,122,204,0.15)` highlight
- Folder icons in gold (#dcb67a), file icons colored by type

### Breadcrumbs
- Height: `~16px` row at top of editor
- Path segments separated by triangle arrows
- `--dev-bg` background, bottom border

### Editor Area
- Two-column grid: `60px` gutter + code area
- Gutter: line numbers right-aligned, muted color, active line highlighted
- Code: monospace, syntax-highlighted using the syntax color tokens above
- Active line: `rgba(255,255,255,0.04)` background highlight spanning full width
- Minimap: `60px` wide strip on right edge, showing simplified colored bars representing code

### Syntax Highlighting Rules
- `import/export/const/let/var/class/return/if/else/async/await` -> blue (keyword)
- `'strings'` and `` `template literals` `` -> orange (string)
- `// comments` and `/* block */` -> green italic (comment)
- `functionName()` -> yellow (function)
- `TypeName`, `InterfaceName` -> teal (type)
- `variableName`, `parameterName` -> light blue (variable)
- `42`, `3.14` -> light green (number)
- `@Decorator` -> purple
- `{`, `}`, `=`, `=>` -> default text (operator)

### Terminal Panel
- Height: `200px` default, resizable
- Header: tab row (Terminal, Problems, Output, Debug Console) with action buttons
- Active tab: bottom blue border
- Body: monospace text, scrollable
- Prompt: teal color (`~/project $`)
- Command: default text color
- Output: secondary text color
- Success messages: green
- Error messages: red
- Blinking cursor: `7x14px` block, default text color

### Status Bar
- Height: `22px`, `--dev-accent` (blue) background, white text
- Left: branch name, error/warning counts
- Right: line/column, encoding, line ending, language, formatter
- Items: `0 8px` padding, hover shows lighter bg

### Buttons
- Primary: `--dev-accent` bg, white text, `4px 12px` padding
- Icon button: `24px` square, no bg, muted text, hover shows subtle bg

### Command Palette
- Centered floating panel, `500px` wide
- Dark bg, border, `6px` radius, large shadow
- Search input at top, results list below

## Responsive Breakpoints

- `1024px`: Hide file explorer, editor takes full width
- `768px`: Hide activity bar, single column layout

## Design Principles

1. **IDE fidelity**: Every pixel should look like it belongs in VS Code Dark+
2. **Information density**: Minimal padding, tight spacing, lots of visible content
3. **Syntax color language**: Use consistent syntax highlighting to make code immediately readable
4. **Functional chrome**: The UI chrome (tabs, explorer, status bar) should feel like real IDE components
5. **Blue accent**: `#007acc` is the signature color - status bar, active indicators, focus states
6. **Layered backgrounds**: `#1e1e1e` (editor) / `#252526` (chrome) / `#2d2d2d` (hover) create subtle depth
7. **Minimal radius**: This is a developer tool, not a consumer app. Keep corners sharp (3px max)
8. **Monospace code, sans-serif UI**: Clear distinction between code content and UI labels
