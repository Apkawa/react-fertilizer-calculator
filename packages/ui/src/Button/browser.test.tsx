// Браузерный регрессионный тест Button (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Button } from "./index";

test("Button: кнопка видна и реагирует на клик", async () => {
  let clicks = 0;
  const { screen } = mountBrowser(
    <Button
      onClick={() => {
        // Клик считаем через document.title — реальное браузерное обновление
        // (отдельный рендер-проход).
        clicks += 1;
        document.title = `clicks=${clicks}`;
      }}
    >
      Готово
    </Button>,
  );
  const button = screen.getByRole("button", { name: "Готово" });
  await expect.element(button).toBeVisible();
  // Реальный клик в браузере (CDP), не имитация testing-library
  await button.click();
  expect(document.title).toBe("clicks=1");
});

test("Button: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<Button>Готово</Button>);
  await expect.element(screen.getByRole("button")).toMatchAriaSnapshot();
});
