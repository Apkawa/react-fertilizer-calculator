import React from "react";
import { renderApp } from "@/test-utils/render";
import { Modal } from "./Modal";

// Смоук: открытая модалка рендерится. ModalContainer — портал
// (#modal-root), поэтому ищем в document.body, а не в контейнере теста.
test("components/ui/Modal smoke: открытая модалка рендерит контент", () => {
  renderApp(
    <Modal opened title="Заголовок модалки" container={() => <div>контент модалки</div>} />,
  );
  expect(document.body.textContent).toContain("Заголовок модалки");
  expect(document.body.textContent).toContain("контент модалки");
}, 15000);
