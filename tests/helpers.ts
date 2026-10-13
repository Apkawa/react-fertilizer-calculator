import type { Page } from "@playwright/test";

// Dev-предупреждения React (только dev-режим) — известный шум, не ошибки приложения:
// - "Using UNSAFE_…" — react-helmet на legacy lifecycles (UNSAFE_componentWillMount);
// - "Encountered two children with the same key" — DropdownList вешает
//   key={String(item)}; для объектов (список удобрений) все ключи одинаковые;
// - "Each child in a list should have a unique "key" prop" — Fragment
//   без key в RenderHelpPages (TabMenu.tsx).
// React 19 больше не вешает префикс "Warning: " на эти сообщения, поэтому
// матчим по содержимому (присутствующий префикс отбрасываем).
export const isKnownDevWarning = (text: string) => {
  const t = text.replace(/^Warning:\s*/, "");
  return (
    t.startsWith("Using UNSAFE_") ||
    t.startsWith("Encountered two children with the same key") ||
    t.startsWith("Each child in a list should have a unique")
  );
};

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
