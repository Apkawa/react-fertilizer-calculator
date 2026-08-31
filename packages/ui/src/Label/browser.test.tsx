// Браузерный регрессионный тест Label (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Checkbox } from "../Checkbox";
import { Label } from "./index";

test("Label: оборачивает контрол, клик по подписи переключает чекбокс", async () => {
  let changed = 0;
  const { screen } = mountBrowser(
    <Label>
      Вес, г
      <Checkbox
        onChange={() => {
          // Нативная семантика label: клик по тексту переключает input
          changed += 1;
          document.title = `changed=${changed}`;
        }}
      />
    </Label>,
  );
  const label = screen.getByText("Вес, г");
  await expect.element(label).toBeVisible();
  // Кликаем именно по тексту подписи, а не по чекбоксу
  await label.click();
  expect(document.title).toBe("changed=1");
  await expect.element(screen.getByRole("checkbox")).toBeChecked();
});

test("Label: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(
    <Label>
      Вес, г
      <Checkbox onChange={() => {}} />
    </Label>,
  );
  await expect.element(screen).toMatchAriaSnapshot();
});
