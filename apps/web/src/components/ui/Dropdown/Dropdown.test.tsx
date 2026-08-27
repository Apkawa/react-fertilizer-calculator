import React from "react";
import { renderApp } from "@/test-utils/render";
import { Dropdown } from "./Dropdown";

test("components/ui/Dropdown smoke: дропдаун рендерит выбранное значение", () => {
  const { container } = renderApp(<Dropdown<string> items={["a", "b"]} value="a" />);
  const input = container.querySelector("input");
  expect(input).not.toBeNull();
  expect(input?.value).toBe("a");
}, 15000);
