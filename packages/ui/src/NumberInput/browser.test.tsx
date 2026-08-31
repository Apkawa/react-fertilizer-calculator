// Браузерный регрессионный тест NumberInput (vitest browser mode, chromium).
import React, { useState } from "react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
import { NumberInput } from "./index";

// Контролируемая обёртка: onChange пишет в стор родителя — как в реальном приложении
function Wrapper() {
  const [v, setV] = useState(1);
  return (
    <NumberInput
      aria-label="Число"
      value={v}
      step={1}
      onChange={(e) => setV(Number(e.target.value))}
    />
  );
}

test("NumberInput: значение рендерится, ввод меняет его", async () => {
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  await expect.element(input).toBeVisible();
  await expect.element(input).toHaveValue("1");
  await input.fill("5");
  await expect.element(input).toHaveValue("5");
});

test("NumberInput: спиннер по фокусу, кнопка вверх увеличивает на step", async () => {
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  // Кнопки спиннера — условный рендер (showBtn по фокусу), без CSS:
  // до фокуса их нет в DOM, после фокуса — появляются
  // Клик по полю = реальный фокус (у Locator нет фокус-метода, есть CDP-клик)
  await userEvent.click(input);
  const up = screen.getByRole("button", { name: "увеличить" });
  await expect.element(up).toBeVisible();
  await up.click();
  await expect.element(input).toHaveValue("2");
});

test("NumberInput: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<NumberInput aria-label="Число" value={1} onChange={() => {}} />);
  await expect.element(screen.getByRole("textbox")).toMatchAriaSnapshot();
});
