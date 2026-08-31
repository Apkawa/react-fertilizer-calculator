import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Dropdown } from "./index";

// Значение инпута-комбобокса (getByRole возвращает HTMLElement).
const comboboxValue = () => (screen.getByRole("combobox") as HTMLInputElement).value;

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

// Кликабельность пунктов: клик по телу пункта выбирает значение — инпут
// показывает выбранное, onChange вызывается, список закрывается.
test("Dropdown: клик по пункту выбирает значение и закрывает список", () => {
  const onChange = vi.fn();
  render(<Dropdown<string> items={["a", "b", "c"]} value="a" onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  fireEvent.click(screen.getAllByRole("option")[1]);
  expect(onChange).toHaveBeenCalledWith("b");
  const input = screen.getByRole("combobox") as HTMLInputElement;
  expect(input.value).toBe("b");
  expect(screen.queryByRole("listbox")).toBeNull();
});

// a11y (useKeyWithClickEvents): у пункта с onClick есть клавиатурный
// эквивалент — пункт фокусируем (tabIndex) и выбирается по Enter/Space.
test("Dropdown: пункт фокусируем и выбирается по Enter", () => {
  const onChange = vi.fn();
  render(<Dropdown<string> items={["a", "b"]} value="a" onChange={onChange} />);
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  const option = screen.getAllByRole("option")[1];
  expect(option.getAttribute("tabindex")).toBe("0");
  fireEvent.keyDown(option, { key: "Enter" });
  expect(onChange).toHaveBeenCalledWith("b");
  expect(comboboxValue()).toBe("b");
});

// Отключённый пункт (checkDisabledItem) кликом не выбирается.
test("Dropdown: клик по отключённому пункту ничего не выбирает", () => {
  const onChange = vi.fn();
  render(
    <Dropdown<string>
      items={["a", "b"]}
      value="a"
      onChange={onChange}
      checkDisabledItem={(item) => item === "b"}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  fireEvent.click(screen.getAllByRole("option")[1]);
  expect(onChange).not.toHaveBeenCalled();
  expect(comboboxValue()).toBe("a");
});

// Пункты с собственными контролами (renderItem): их обработчики делают
// stopPropagation — клик по кнопке внутри строки не выбирает пункт.
test("Dropdown: кнопка внутри renderItem не выбирает пункт", () => {
  const onChange = vi.fn();
  render(
    <Dropdown<string>
      items={["a", "b"]}
      value="a"
      onChange={onChange}
      renderItem={({ item }) => (
        <span>
          {item}
          <button type="button" onClick={(event) => event.stopPropagation()}>
            x
          </button>
        </span>
      )}
    />,
  );
  fireEvent.click(screen.getByRole("button", { name: "Открыть список" }));
  fireEvent.click(screen.getAllByRole("option")[1].querySelector("button")!);
  expect(onChange).not.toHaveBeenCalled();
  expect(comboboxValue()).toBe("a");
});
