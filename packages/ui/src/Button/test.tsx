import { render } from "@testing-library/react";
import React from "react";
import { Button } from "./index";

test("Button: рендерит кнопку с текстом", () => {
  const { container } = render(<Button>Готово</Button>);
  const button = container.querySelector("button") as HTMLButtonElement;
  expect(button).not.toBeNull();
  expect(button.textContent).toBe("Готово");
});

// Stage 2 «restyle» (red-фаза): стабильный хук data-ui — точка таргета схем
// (`html[data-scheme=x] [data-ui=button]`); атрибут ещё не проставлен — красный.
test('Button: корень несёт хук data-ui="button"', () => {
  const { container } = render(<Button>Готово</Button>);
  const button = container.querySelector("button") as HTMLButtonElement;
  expect(button.getAttribute("data-ui")).toBe("button");
});
