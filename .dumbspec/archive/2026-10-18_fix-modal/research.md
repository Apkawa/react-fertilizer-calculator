# Research: 2026-10-18_fix-modal

## Relevant files

| File | Role |
|---|---|
| `packages/ui/src/Modal/index.tsx` | Modal component source |
| `packages/ui/src/Modal/style.module.css` | Modal styles (CSS module, hashed class names — not the `ui-*` plain-class convention) |
| `packages/ui/src/Modal/test.tsx` | jsdom unit tests (structure/a11y/focus only — no layout assertions) |
| `packages/ui/src/Modal/browser.test.tsx` | vitest browser (chromium) regression tests (open/close/focus/ARIA snapshot) |
| `packages/ui/src/Modal/Modal.stories.tsx` | Storybook: `Default` (closed) + `Opened` stories, no size variants |
| `packages/ui/src/index.ts` | Barrel export (line 17) |
| `packages/ui/src/theme.css` | Defines `--color-background`, `--shadow-small` used by the card; no modal rules |

## Current implementation (facts)

- Props API: `opened?`, `onClose?`, `button?` (render-prop `{ modal: ModalActions }`), `title?`, `container` (required render-prop). **No width/size prop exists.**
- Rendering: conditional (`closed ? null : …`); `ModalContainer` portals into an imperatively created, unstyled `#modal-root` div on `document.body` (no CSS for it anywhere).
- A `<Helmet><style>` injects `body { overflow: hidden }` while open.
- Overlay: inline `style={{ top: window.pageYOffset }}` + class `css.modalOverlay`; card: `css.modalCard` with `role="dialog"`, `aria-modal`, `aria-labelledby`, `tabIndex=-1`.
- Header inside card: `<div className="flex justify-between">` → `<h2 className={textCss.heading}>` + close `<button aria-label="Закрыть">` with `<Icon name="close" />`; content wrapped in a bare `<div>`.

### `style.module.css` (full)

```css
@layer components {
  .modalOverlay {
    overflow-y: auto;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 999;
  }

  @media screen and (max-height: 500px), screen and (max-width: 500px) {
    .modalOverlay {
      align-items: initial;
    }
  }

  .modalCard {
    background-color: var(--color-background);
    box-shadow: var(--shadow-small);
    padding: 8px;
    width: 80%;
    max-height: 80%;
    overflow-y: auto;
  }

  @media screen and (max-width: 500px) {
    .modalCard {
      width: 100%;
      max-height: 100%;
    }
  }
}
```

## Bugs identified (root causes of the user report)

1. **No centering:** `.modalOverlay` has `justify-content`/`align-items: center` but **no `display: flex` declaration** — the properties are no-ops, so the card sits at the top-left of the overlay (visible in the screenshot).
2. **Scroll-offset hack:** overlay is `position: absolute` with inline `top: window.pageYOffset` — fragile (only correct at the render moment; the unstyled static `#modal-root` host makes absolute positioning resolve against the page, not the viewport).
3. **Content stretched:** `.modalCard { width: 80% }` — width imposed by the card on the content, not the other way around. No `max-width` either.
4. Mobile media query drops `align-items` (to the broken default) at ≤500px and forces `width: 100%`.

## Call sites (all use only `title`/`button`/`container`; no size props anywhere)

- `apps/web/src/components/Calculator/Options/Recipe.tsx` — "Настройка профиля", renders `<RecipeTuneForm>` (NPK matrix of NumberInputs, ratios, EC, HPG profile text).
- `apps/web/src/components/Calculator/Options/RecipeTuneForm.tsx` — content of the above modal (receives `modal: ModalActions`).
- `apps/web/src/components/Calculator/Mixer/Mixer.tsx` — `MixerModal`: `<MixerOptionsForm>` + "Приготовить".
- `apps/web/src/components/Calculator/Result/Result.tsx` — `<FertilizerAddEditForm>` + Save; also renders `<MixerModal />`.
- `apps/web/src/components/Calculator/FertilizerManager/Item.tsx` — `<AddEdit>` (fertilizer edit) + Save.
- `apps/web/src/components/Calculator/FertilizerManager/List.tsx` — `<AddEdit />` (new fertilizer) + Save.

## Tests (current assertions)

- `test.tsx` (jsdom): portal content in `document.body`; close button with `aria-label="Закрыть"`; `role=dialog`/`aria-modal`/`tabindex`/`aria-labelledby` → `<h2>`; focus moves into dialog on open and returns to trigger on close. **No layout/width/centering assertions.**
- `browser.test.tsx` (chromium): open/close/focus flow + ARIA snapshot. **No geometry assertions.**

## Constraints

- Stack: React 16 (no `useId`), TS strict, CSS modules in `packages/ui` (Modal uses `style.module.css`, not plain `ui-*` classes).
- Existing tests must keep passing; TDD (red → green). Browser tests are local/manual (`pnpm -C packages/ui test:browser`), not in CI/full-check; jsdom tests are in `pnpm test`.
- Pre-commit husky runs `pnpm full-check` (test + lint + type + build).
- User-confirmed decision: modal capped by the viewport, with internal scroll when content doesn't fit.
