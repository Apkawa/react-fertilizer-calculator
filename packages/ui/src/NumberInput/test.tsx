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
