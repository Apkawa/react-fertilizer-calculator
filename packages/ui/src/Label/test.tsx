import { render } from "@testing-library/react";
import React from "react";
import { Label } from "./index";

test("Label: оборачивает содержимое", () => {
  const { container } = render(<Label>Вес, г</Label>);
  const label = container.querySelector("label");
  expect(label).not.toBeNull();
  expect(label?.textContent).toBe("Вес, г");
});
