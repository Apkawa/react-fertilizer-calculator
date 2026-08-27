import type { Page } from "@playwright/test";

// Dev-предупреждения React 16 (только dev-режим) — известный шум, не ошибки приложения:
// - "Warning: Using UNSAFE_…" — redux-form (Form/Field/FieldArray) на legacy lifecycles;
// - "Warning: Encountered two children with the same key" — DropdownList вешает
//   key={String(item)}; для объектов (список удобрений) все ключи одинаковые;
// - "Warning: Each child in a list should have a unique "key" prop" — Fragment
//   без key в RenderHelpPages (TabMenu.tsx).
export const isKnownDevWarning = (text: string) =>
  text.startsWith("Warning: Using UNSAFE_") ||
  text.startsWith("Warning: Encountered two children with the same key") ||
  text.startsWith("Warning: Each child in a list should have a unique");

/**
 * Следит за console.error и pageerror (непойманные исключения).
 * Возвращает функцию, отдающую накопленные ошибки — для ассерта `toEqual([])`.
 */
export function trackConsoleErrors(page: Page): () => string[] {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" && !isKnownDevWarning(m.text())) errors.push(m.text());
  });
  page.on("pageerror", (e) => errors.push(String(e)));
  return () => errors;
}
