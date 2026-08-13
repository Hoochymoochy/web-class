# Design Status — Red Button

**Branch:** `agent/design`  
**Verdict:** Spec complete — ready for Frontend

## Deliverables

| File | Description |
|------|-------------|
| `design/RED_BUTTON_SPEC.md` | Visual & interaction spec (shade, size, states, placement) |
| `design/red-button.tokens.css` | CSS custom properties for optional token-based styling |

## Summary

- **Shade:** `red-600` default, `red-700` hover, `red-800` active, white text
- **Size:** `px-4 py-2 rounded-lg font-medium` (matches task modal primaries)
- **States:** hover, active, disabled (`opacity-50`), focus-visible ring
- **Placement:** Home — above “Add Task”; About — after intro paragraph

## Waiting on

- Frontend: implement `<button data-testid="red-button">` on `/` and `/about`
- QA: E2E sign-off after implementation
