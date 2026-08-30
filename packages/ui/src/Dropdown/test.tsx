import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Dropdown } from "./index";

test("Dropdown smoke: дропдаун рендерит выбранное значение", () => {
  const { container } = render(<Dropdown<string> items={["a", "b"]} value="a" />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.value).toBe("a");
});

// a11y (stage 2): шеврон-триггер — настоящая <button> с доступным именем
// (ранее кликабельный div-Icon без имени — axe button-name).
// Имя зависит от состояния: закрыт — «Открыть список», открыт — «Закрыть список».
test("Dropdown: шеврон — <button> с именем, открывает список", () => {
  render(<Dropdown<string> items={["a", "b"]} value="a" />);
  const button = screen.getByRole("button", { name: "Открыть список" });
  expect(button.tagName).toBe("BUTTON");
  fireEvent.click(button);
  expect(screen.getByRole("listbox")).not.toBeNull();
  // Открытое состояние — имя сменилось
  expect(screen.getByRole("button", { name: "Закрыть список" })).not.toBeNull();
});

// a11y (stage 4): семантика combobox — триггер имеет доступное имя (label-проп),
// состояние раскрытия (aria-expanded) и aria-controls на открытый список
// (стабильный уникальный id на инстанс — в React 16 нет useId).
test("Dropdown: триггер — combobox с именем, aria-expanded и aria-controls", () => {
  render(<Dropdown<string> items={["a", "b"]} value="a" label="Выбор значения" />);
  const input = screen.getByRole("combobox", { name: "Выбор значения" });
  expect(input.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  expect(input.getAttribute("aria-expanded")).toBe("true");
  const listbox = screen.getByRole("listbox");
  expect(input.getAttribute("aria-controls")).toBe(listbox.id);
  expect(listbox.id).toBeTruthy();
});

// a11y (stage 4): aria-required-children — прямыми детьми listbox являются
// элементы role="option" (без промежуточных обёрток вокруг пунктов).
test("Dropdown: у listbox есть пункты role=option прямыми детьми", () => {
  render(<Dropdown<string> items={["a", "b", "c"]} value="a" />);
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  const listbox = screen.getByRole("listbox");
  const options = Array.from(listbox.querySelectorAll('[role="option"]'));
  expect(options).toHaveLength(3);
  for (const option of options) {
    expect(option.parentElement).toBe(listbox);
  }
});

// a11y (stage 4): nested-interactive — пункт не самостоятельный интерактивный
// элемент: у обёртки нет tabindex, клик по телу пункта ничего не выбирает
// (интерактивные контролы — кнопки внутри строк).
test("Dropdown: пункты не фокусируемы и не выбираются кликом по телу", () => {
  render(<Dropdown<string> items={["a", "b"]} value="a" />);
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  const option = screen.getAllByRole("option")[0];
  expect(option.hasAttribute("tabindex")).toBe(false);
  fireEvent.click(option);
  expect(screen.getByRole("listbox")).not.toBeNull();
});
