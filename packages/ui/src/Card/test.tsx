import { render } from "@testing-library/react";
import React from "react";
import { Card } from "./index";

test("Card: рендерит блок с содержимым", () => {
  const { container } = render(<Card>содержимое</Card>);
  expect(container.textContent).toBe("содержимое");
});

// Stage 2 «restyle» (red-фаза): хук data-ui на корневом div карточки —
// schemes таргетятся через `html[data-scheme=x] [data-ui=card]`; красный.
test('Card: корень несёт хук data-ui="card"', () => {
  const { container } = render(<Card>содержимое</Card>);
  const card = container.firstElementChild as HTMLElement;
  expect(card.getAttribute("data-ui")).toBe("card");
});
