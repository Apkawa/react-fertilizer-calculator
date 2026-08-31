import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { Radio } from "./index";

test("Radio: рендерит радио-кнопку", () => {
  const { container } = render(<Radio name="a" value="1" onChange={() => {}} />);
  const input = container.querySelector("input") as HTMLInputElement;
  expect(input).not.toBeNull();
  expect(input.type).toBe("radio");
});

test("Radio: выбранное значение соответствует checked", () => {
  const { container } = render(<Radio name="a" value="1" checked={true} onChange={() => {}} />);
  const input = container.querySelector("input") as HTMLInputElement;
  expect(input.checked).toBe(true);
});

test("Radio: onChange при выборе", () => {
  const onChange = vi.fn();
  const { container } = render(<Radio name="a" value="1" checked={false} onChange={onChange} />);
  fireEvent.click(container.querySelector("input") as HTMLInputElement);
  expect(onChange).toHaveBeenCalledTimes(1);
});
