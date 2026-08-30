import { render, screen } from "@testing-library/react";
import React from "react";
import { Modal } from "./modal";

// Открытая модалка рендерится. ModalContainer — портал (#modal-root),
// поэтому ищем в document.body, а не в контейнере теста.
test("Modal smoke: открытая модалка рендерит контент", () => {
  render(<Modal opened title="Заголовок модалки" container={() => <div>контент модалки</div>} />);
  expect(document.body.textContent).toContain("Заголовок модалки");
  expect(document.body.textContent).toContain("контент модалки");
});

// a11y (stage 2): контрол закрытия — настоящая <button> с доступным именем
// (ранее кликабельный div-Icon без имени — axe button-name).
test("Modal: контрол закрытия — <button> с доступным именем «Закрыть»", () => {
  render(<Modal opened title="Заголовок модалки" container={() => <div>контент модалки</div>} />);
  const button = screen.getByRole("button", { name: "Закрыть" });
  expect(button.tagName).toBe("BUTTON");
  expect(button.getAttribute("aria-label")).toBe("Закрыть");
});
