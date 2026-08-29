import { render } from "@testing-library/react";
import React from "react";
import { Modal } from "./modal";

// Открытая модалка рендерится. ModalContainer — портал (#modal-root),
// поэтому ищем в document.body, а не в контейнере теста.
test("Modal smoke: открытая модалка рендерит контент", () => {
  render(<Modal opened title="Заголовок модалки" container={() => <div>контент модалки</div>} />);
  expect(document.body.textContent).toContain("Заголовок модалки");
  expect(document.body.textContent).toContain("контент модалки");
});
