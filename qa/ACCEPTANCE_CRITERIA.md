# Red Button — Acceptance Criteria

QA verification contract for the mission: **Create a red button**.

## Implementation contract

| Requirement | Detail |
|-------------|--------|
| Element | Native `<button>` |
| Selector | `data-testid="red-button"` |
| Placement | Home (`/`) and About (`/about`) |
| Label | Visible text or `aria-label` |
| Background | Red via Tailwind `bg-red-*` or inline/CSS red value |
| Click | Responds to pointer click without error |
| Keyboard | Focusable; activates with Enter and Space |

## Cross-browser matrix

Verified in Playwright against:

- Chromium (Chrome/Edge)
- Firefox
- WebKit (Safari)

## Pass criteria

All checks in `my-react-app/e2e/red-button.spec.ts` must pass:

1. Button is present and visible on target pages
2. Computed background color is predominantly red (R high, G/B low)
3. Click succeeds and button remains interactive
4. Enter and Space activate the focused button
5. Same results across Chromium, Firefox, and WebKit

## Run verification

```bash
cd my-react-app
npm run test:e2e
```
