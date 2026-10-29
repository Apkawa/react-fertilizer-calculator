import { fireEvent, render } from "@testing-library/react";
import React, { useState } from "react";
import { NumberInput } from "./index";

// Портирован из apps/web ui/RebassWidgets/Number.test.tsx
test("smoke: числовой инпут рендерится со значением", () => {
  const { container } = render(<NumberInput value={1} />);
  const input = container.querySelector("input") as HTMLInputElement;
  expect(input).not.toBeNull();
  expect(input.value).toBe("1");
});

// Контролируемая обёртка: onChange пишет в стор родителя — как в реальном приложении
function Wrapper() {
  const [v, setV] = useState(1);
  return <NumberInput value={v} step={1} onChange={(e) => setV(Number(e.target.value))} />;
}

test("спиннер: кнопка вверх увеличивает значение на step", () => {
  const { container } = render(<Wrapper />);
  const input = container.querySelector("input") as HTMLInputElement;
  fireEvent.focus(input);
  const up = Array.from(container.querySelectorAll("button")).find((b) => b.textContent === "^");
  expect(up).toBeDefined();
  fireEvent.click(up as HTMLButtonElement);
  expect(input.value).toBe("2");
});

// Косметическая правка: при disabled инпута кнопки спиннера тоже disabled
// (иначе клик по видимой кнопке меняет значение disabled-поля)
test("спиннер: при disabled инпута кнопки спиннера тоже disabled", () => {
  const { container } = render(<NumberInput value={1} disabled />);
  fireEvent.focus(container.querySelector("input") as HTMLInputElement);
  const buttons = Array.from(container.querySelectorAll("button"));
  expect(buttons).toHaveLength(2);
  expect(buttons.every((b) => b.disabled)).toBe(true);
});

// Тултип при наведении: кнопка спиннера несёт title = доступное имя (round 7)
test("спиннер: title кнопок берётся из aria-label", () => {
  const { container } = render(<NumberInput value={1} />);
  fireEvent.focus(container.querySelector("input") as HTMLInputElement);
  const buttons = Array.from(container.querySelectorAll("button"));
  expect(buttons.map((b) => [b.getAttribute("aria-label"), b.getAttribute("title")])).toEqual([
    ["увеличить", "увеличить"],
    ["уменьшить", "уменьшить"],
  ]);
});

// Stage 2 «restyle» (red-фаза): NumberInput рендерит свою обёртку (не
// Input-компонент — внутренний <input> использует класс Input), поэтому
// хук обёртки — "number-input", а не "input". Красный.
test('NumberInput: обёртка несёт хук data-ui="number-input"', () => {
  const { container } = render(<NumberInput value={1} />);
  const wrapper = container.firstElementChild as HTMLElement;
  expect(wrapper.getAttribute("data-ui")).toBe("number-input");
});
