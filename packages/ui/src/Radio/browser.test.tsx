// Браузерный регрессионный тест Radio (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Radio } from "./index";

test("Radio: выбранное значение соответствует checked", async () => {
  const { screen } = mountBrowser(<Radio name="a" value="1" checked onChange={() => {}} />);
  const radio = screen.getByRole("radio");
  await expect.element(radio).toBeVisible();
  await expect.element(radio).toBeChecked();
});

test("Radio: onChange при выборе", async () => {
  let changed = 0;
  const { screen } = mountBrowser(
    <Radio
      name="a"
      value="1"
      onChange={() => {
        // Реальный клик в браузере: onChange срабатывает по CDP-событию
        changed += 1;
        document.title = `changed=${changed}`;
      }}
    />,
  );
  const radio = screen.getByRole("radio");
  await expect.element(radio).not.toBeChecked();
  await radio.click();
  expect(document.title).toBe("changed=1");
  await expect.element(radio).toBeChecked();
});

test("Radio: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(
    <Radio name="a" value="1" aria-label="Вариант 1" checked={false} onChange={() => {}} />,
  );
  await expect.element(screen.getByRole("radio")).toMatchAriaSnapshot();
});
