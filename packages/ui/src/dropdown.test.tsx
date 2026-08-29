import { render } from "@testing-library/react";
import React from "react";
import { Dropdown } from "./dropdown";

test("Dropdown smoke: дропдаун рендерит выбранное значение", () => {
  const { container } = render(<Dropdown<string> items={["a", "b"]} value="a" />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.value).toBe("a");
});
