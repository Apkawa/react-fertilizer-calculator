import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Input } from "./index";

test("Input: рендерит input с переданным значением", () => {
  render(<Input value="42" onChange={() => {}} />);
  const input = screen.getByRole("textbox") as HTMLInputElement;
  expect(input.value).toBe("42");
});

test("Input: onChange получает событие с введённым значением", () => {
  const onChange = vi.fn();
  const { container } = render(<Input value="" onChange={onChange} />);
  fireEvent.change(container.querySelector("input") as HTMLInputElement, {
    target: { value: "123" },
  });
  expect(onChange).toHaveBeenCalledTimes(1);
});
