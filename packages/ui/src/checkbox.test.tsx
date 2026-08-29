import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Checkbox } from "./checkbox";

test("Checkbox: рендерит не отмеченный чекбокс", () => {
  const { container } = render(<Checkbox onChange={() => {}} />);
  const input = container.querySelector("input") as HTMLInputElement;
  expect(input).not.toBeNull();
  expect(input.type).toBe("checkbox");
  expect(input.checked).toBe(false);
});

test("Checkbox: onChange получает checked при клике", () => {
  const onChange = vi.fn();
  const { container } = render(<Checkbox checked={false} onChange={onChange} />);
  fireEvent.click(container.querySelector("input") as HTMLInputElement);
  expect(onChange).toHaveBeenCalledTimes(1);
});
