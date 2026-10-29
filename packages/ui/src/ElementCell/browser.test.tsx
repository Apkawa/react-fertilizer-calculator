// Браузерный регрессионный тест ElementCell (vitest browser mode, chromium).
// Red-фаза Stage 3: атома ещё нет — импорт ./index падает; ARIA-снапшот
// базового рендера создастся при green-прогоне.
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { ElementCell } from "./index";

test("ElementCell: ячейка видна, дельта с атрибутом знака", async () => {
  const { screen } = mountBrowser(<ElementCell name="K" value="140" delta="−49" />);
  // Атрибутный селектор в lib.dom даёт Element — cast к HTMLElement для
  // expect.element (стабильный контракт — хук на div-корне).
  const cell = screen.element().querySelector('[data-ui="element-cell"]') as HTMLElement | null;
  expect(cell).not.toBeNull();
  await expect.element(cell).toBeVisible();
  await expect.element(cell).toHaveTextContent("K");
  await expect.element(cell).toHaveTextContent("140");
  const delta = screen.element().querySelector('[data-delta="minus"]') as HTMLElement | null;
  expect(delta).not.toBeNull();
  await expect.element(delta).toHaveTextContent("−49");
});

test("ElementCell: ARIA-снапшот базового рендера (без дельты)", async () => {
  const { screen } = mountBrowser(<ElementCell name="Fe" value="1.4" />);
  const cell = screen.element().querySelector('[data-ui="element-cell"]') as HTMLElement | null;
  await expect.element(cell).toMatchAriaSnapshot();
});
