// Браузерный регрессионный тест Chip (vitest browser mode, chromium).
// Red-фаза Stage 3: атома ещё нет — импорт ./index падает; ARIA-снапшот
// базового рендера создастся при green-прогоне.
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Chip } from "./index";

test("Chip: чип виден, тексты label/value на месте", async () => {
  const { screen } = mountBrowser(<Chip label="EC" value="1.83" />);
  // Атрибутный селектор в lib.dom даёт Element — cast к HTMLElement для
  // expect.element (стабильный контракт — хук на div-корне).
  const chip = screen.element().querySelector('[data-ui="chip"]') as HTMLElement | null;
  expect(chip).not.toBeNull();
  await expect.element(chip).toBeVisible();
  await expect.element(screen.getByText("EC")).toBeVisible();
  await expect.element(screen.getByText("1.83")).toBeVisible();
});

test("Chip: ARIA-снапшот базового рендера", async () => {
  const { screen } = mountBrowser(<Chip label="EC" value="1.83" />);
  const chip = screen.element().querySelector('[data-ui="chip"]') as HTMLElement | null;
  await expect.element(chip).toMatchAriaSnapshot();
});
