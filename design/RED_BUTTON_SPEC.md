# Red Button — Visual & Interaction Spec

**Agent:** Design  
**Branch:** `agent/design`  
**Mission:** Create a red button  
**Status:** Ready for Frontend implementation

---

## Purpose

Define a filled **primary-style red button** that matches existing product button conventions (see blue CTAs in `Home.tsx`, `Tasks.tsx`, `Team.tsx`) while using the app’s established red semantic palette. This spec is the source of truth for shade, size, states, and placement.

---

## Implementation contract (shared with QA)

| Property | Value |
|----------|-------|
| Element | Native `<button>` |
| Test ID | `data-testid="red-button"` |
| Pages | Home (`/`) and About (`/about`) |
| Label | Visible text **or** `aria-label` (prefer visible text) |
| Default label | `"Red Button"` |
| Background | Must read as red in default state (QA: R > 120, G & B < 120) |

---

## Color — red shade

Mirror the **blue primary ladder** (`blue-600` → `blue-700` → `blue-800`) with Tailwind `red-*` at the same weight. Aligns with existing semantic red usage (`bg-red-500` priority badges, `text-red-400` destructive menu items).

| Token | Tailwind | Hex | RGB | Usage |
|-------|----------|-----|-----|-------|
| `--red-button-bg` | `red-600` | `#dc2626` | `220, 38, 38` | Default |
| `--red-button-bg-hover` | `red-700` | `#b91c1c` | `185, 28, 28` | Hover |
| `--red-button-bg-active` | `red-800` | `#991b1b` | `153, 27, 27` | Active / pressed |
| `--red-button-bg-disabled` | `red-600` | `#dc2626` | (same as default) | Disabled (via opacity) |
| `--red-button-text` | — | `#ffffff` | `255, 255, 255` | Label |
| `--red-button-focus-ring` | `red-400` | `#f87171` | — | Focus ring |

**Rationale:** `red-600` default keeps parity with `bg-blue-600` primaries; all states pass QA red-channel checks and meet **WCAG AA** contrast with white text (~5.9:1 on `red-600`).

Do **not** use translucent red fills or text-only red styling for this component — it is a **filled** primary button.

---

## Size & typography

Match the **modal primary button** pattern used on task pages (most common solid CTA in the app).

| Property | Value | Tailwind |
|----------|-------|----------|
| Height (content box) | ~40px | `py-2` (8px × 2 + line-height) |
| Horizontal padding | 16px | `px-4` |
| Border radius | 8px | `rounded-lg` |
| Font size | 16px (inherit) | default / `text-base` |
| Font weight | 500 | `font-medium` |
| Min width | none (label-driven) | — |
| Border | none | `border-0` (overrides global Vite `button` border) |

**Reference (blue primary on task modals):**

```tsx
className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50"
```

---

## States

| State | Background | Text | Cursor | Other |
|-------|------------|------|--------|-------|
| **Default** | `bg-red-600` | `text-white` | `cursor-pointer` | `transition-colors duration-200` |
| **Hover** | `hover:bg-red-700` | `text-white` | `cursor-pointer` | Only when `:not(:disabled)` |
| **Active** | `active:bg-red-800` | `text-white` | `cursor-pointer` | Optional subtle press: `active:scale-[0.98]` |
| **Focus-visible** | `bg-red-600` (unchanged) | `text-white` | — | `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900` |
| **Disabled** | `bg-red-600` + `disabled:opacity-50` | `text-white` | `disabled:cursor-not-allowed` | Set `disabled` attribute; no hover/active styles |

**Keyboard:** Native button semantics — Tab to focus, Enter and Space to activate (QA requirement).

**Loading (optional):** If async, swap label text (e.g. `"Loading..."`) and set `disabled` + `aria-busy="true"`. Do not change background color while loading.

---

## Canonical Tailwind class string

Frontend should apply these classes on the native `<button>` (plus `data-testid="red-button"`):

```
inline-flex items-center justify-center px-4 py-2 rounded-lg border-0
bg-red-600 hover:bg-red-700 active:bg-red-800
text-white font-medium
transition-colors duration-200
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
disabled:opacity-50 disabled:cursor-not-allowed
```

---

## Placement

Both pages use the purple **Grainient** background. The button sits on transparent page chrome — no extra card wrapper required.

### Home (`/`)

```
┌─────────────────────────────────────┐
│              Header                 │
│         "Personal Tasks"            │  ← BlurText title
│                                     │
│  [ Red Button ]                     │  ← THIS SPEC (left-aligned)
│  [ Add Task + ]                     │  ← existing blue CTA
│  … task grid …                      │
└─────────────────────────────────────┘
```

| Rule | Value |
|------|-------|
| Container | Inside `w-full max-w-6xl` content column (same as Add Task) |
| Alignment | Left-aligned (default block flow) |
| Order | **Above** the existing “Add Task” button |
| Spacing | `mb-3` below red button; Add Task keeps its existing `mb-6` |
| Visibility | Must remain visible when tasks load (not inside loading/empty conditionals) |

### About (`/about`)

```
┌─────────────────────────────────────┐
│  About                              │
│  Intro paragraph…                   │
│                                     │
│  [ Red Button ]                     │  ← THIS SPEC
│                                     │
│  Created by …                       │
└─────────────────────────────────────┘
```

| Rule | Value |
|------|-------|
| Wrapper | Centered column: `flex flex-col items-center p-4 min-h-screen` (match Home page shell) |
| Content width | `max-w-2xl w-full` inner block, left-aligned text |
| Order | After intro `<p>`, before author credit |
| Spacing | `mt-6 mb-4` on the button |
| Heading | Style About heading to `text-2xl text-slate-100 mb-4` for visual parity with task pages |

---

## Design tokens (CSS custom properties)

Optional reference for shared stylesheets — copy into `index.css` or a component if Frontend prefers tokens over raw Tailwind:

```css
:root {
  --red-button-bg: #dc2626;
  --red-button-bg-hover: #b91c1c;
  --red-button-bg-active: #991b1b;
  --red-button-text: #ffffff;
  --red-button-focus-ring: rgba(248, 113, 113, 0.7);
  --red-button-radius: 8px;
  --red-button-padding-y: 8px;
  --red-button-padding-x: 16px;
}
```

See `design/red-button.tokens.css` for the full token file.

---

## Out of scope (other agents)

| Area | Owner |
|------|-------|
| React component implementation | Frontend |
| Accessibility audit & ARIA refinements | Accessibility |
| E2E verification | QA |

---

## Acceptance checklist (Design)

- [x] Red shade defined with hex, RGB, and Tailwind mapping
- [x] Size matches existing primary button conventions
- [x] Hover, active, disabled, and focus-visible states specified
- [x] Placement documented for Home and About
- [x] QA contract (`data-testid`, pages, red background) referenced
