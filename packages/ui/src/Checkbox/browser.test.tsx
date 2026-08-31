// Браузерный регрессионный тест Checkbox (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Checkbox } from "./index";

test("Checkbox: рендерит не отмеченный чекбокс", async () => {
  const { screen } = mountBrowser(<Checkbox aria-label="Согласен" onChange={() => {}} />);
  const checkbox = screen.getByRole("checkbox");
  await expect.element(checkbox).toBeVisible();
  await expect.element(checkbox).not.toBeChecked();
});

test("Checkbox: onChange при клике, чекбокс отмечается", async () => {
  let changed = 0;
  const { screen } = mountBrowser(
    <Checkbox
      aria-label="Согласен"
      onChange={() => {
        // Реальный клик в браузере: onChange срабатывает по CDP-событию
        changed += 1;
        document.title = `changed=${changed}`;
      }}
    />,
  );
  const checkbox = screen.getByRole("checkbox");
  await checkbox.click();
  expect(document.title).toBe("changed=1");
  // checked — свойство DOM (нативный toggle), не атрибут
  await expect.element(checkbox).toBeChecked();
});

test("Checkbox: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<Checkbox aria-label="Согласен" onChange={() => {}} />);
  await expect.element(screen.getByRole("checkbox")).toMatchAriaSnapshot();
});
