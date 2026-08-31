import { render } from "@testing-library/react";
import React from "react";
import { Button } from "./index";

test("Button: рендерит кнопку с текстом", () => {
  const { container } = render(<Button>Готово</Button>);
  const button = container.querySelector("button") as HTMLButtonElement;
  expect(button).not.toBeNull();
  expect(button.textContent).toBe("Готово");
});
