// Браузерный регрессионный тест Input (vitest browser mode, chromium).
import React, { useState } from "react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
import { Input } from "./index";

test("Input: рендерит input с переданным значением", async () => {
  const { screen } = mountBrowser(<Input aria-label="Поле" value="42" onChange={() => {}} />);
  const input = screen.getByRole("textbox");
  await expect.element(input).toBeVisible();
  await expect.element(input).toHaveValue("42");
});

test("Input: onChange при вводе (userEvent из vitest/browser)", async () => {
  let changes = 0;
  // Контролируемая обёртка с состоянием: без state React 16 откатывает value
  // (restoreControlledState) — как в реальном приложении, onChange пишет в state
  function Wrapper() {
    const [v, setV] = useState("");
    return (
      <Input
        aria-label="Поле"
        value={v}
        onChange={(e) => {
          // Каждый нажатый символ — отдельное CDP-событие ввода
          changes += 1;
          setV(e.target.value);
        }}
      />
    );
  }
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  // Не @testing-library/user-event, а userEvent из vitest/browser (CDP)
  await userEvent.type(input, "123");
  expect(changes).toBe(3);
  await expect.element(input).toHaveValue("123");
});

test("Input: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<Input aria-label="Поле" value="" onChange={() => {}} />);
  await expect.element(screen.getByRole("textbox")).toMatchAriaSnapshot();
});
