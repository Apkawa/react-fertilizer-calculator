// Браузерный регрессионный тест Dropdown (vitest browser mode, chromium).
import React from "react";
import { expect, test } from "vitest";
import { mountBrowser } from "../browser-test-utils";
import { Dropdown } from "./index";

test("Dropdown: шеврон открывает список, aria-expanded переключается", async () => {
  const { screen } = mountBrowser(
    <Dropdown<string> items={["a", "b", "c"]} value="a" label="Выбор значения" />,
  );
  const combobox = screen.getByRole("combobox", { name: "Выбор значения" });
  const chevron = screen.getByRole("button", { name: "Открыть список" });
  await expect.element(combobox).toBeVisible();
  await expect.element(combobox).toHaveValue("a");
  await expect.element(combobox).toHaveAttribute("aria-expanded", "false");
  // Список до открытия — только условный рендер: в DOM его нет
  const listbox = screen.getByRole("listbox");
  await expect.element(listbox).not.toBeInTheDocument();

  // Реальный клик по шеврону: список появляется, состояние раскрытия — true
  await chevron.click();
  await expect.element(listbox).toBeVisible();
  await expect.element(combobox).toHaveAttribute("aria-expanded", "true");
  // Имя шеврона сменилось на закрытое состояние
  await expect.element(screen.getByRole("button", { name: "Закрыть список" })).toBeVisible();
  // Три прямых пункта role=option
  expect(screen.getByRole("option").all().length).toBe(3);

  // Клик по закрытому шеврону сворачивает список
  await screen.getByRole("button", { name: "Закрыть список" }).click();
  await expect.element(listbox).not.toBeInTheDocument();
  await expect.element(combobox).toHaveAttribute("aria-expanded", "false");
});

test("Dropdown: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(
    <Dropdown<string> items={["a", "b"]} value="a" label="Выбор значения" />,
  );
  await expect.element(screen.getByRole("combobox")).toMatchAriaSnapshot();
});
