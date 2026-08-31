import { render } from "@testing-library/react";
import React from "react";
import { Card } from "./index";

test("Card: рендерит блок с содержимым", () => {
  const { container } = render(<Card>содержимое</Card>);
  expect(container.textContent).toBe("содержимое");
});
