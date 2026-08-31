// Браузерный регрессионный тест Card (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Card } from "./index";

test("Card: карточка рендерит содержимое", async () => {
  const { screen } = mountBrowser(<Card>содержимое карточки</Card>);
  const content = screen.getByText("содержимое карточки");
  await expect.element(content).toBeVisible();
  // Локаторов у vitest-Locator меньше, чем у Playwright: div-обёртку
  // проверяем через element() (DOM-элемент контейнера)
  const card = screen.element().querySelector("div");
  expect(card).not.toBeNull();
  await expect.element(card).toHaveTextContent("содержимое карточки");
});

test("Card: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<Card>содержимое карточки</Card>);
  await expect.element(screen).toMatchAriaSnapshot();
});
