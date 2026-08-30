import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Dropdown } from "./dropdown";

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
