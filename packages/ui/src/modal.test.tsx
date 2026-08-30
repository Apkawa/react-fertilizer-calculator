import { act, render, screen } from "@testing-library/react";
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

// a11y (stage 3): модалка по реальному паттерну использования — триггер это
// button-колбэк, который вызывает modal.open(); клик по нему открывает модалку.
function TriggeredModal() {
  return (
    <Modal
      title="Заголовок модалки"
      button={({ modal }) => (
        <button type="button" onClick={modal.open}>
          Триггер
        </button>
      )}
      container={() => <div>контент модалки</div>}
    />
  );
}

test("Modal: диалог — role=dialog, aria-modal=true, aria-labelledby на заголовок <h2>", () => {
  render(<Modal opened title="Заголовок модалки" container={() => <div>контент модалки</div>} />);
  const dialog = screen.getByRole("dialog");
  expect(dialog.getAttribute("aria-modal")).toBe("true");
  // tabIndex=-1: диалог фокусируется программно, но не участвует в tab-порядке.
  expect(dialog.getAttribute("tabindex")).toBe("-1");
  const labelledby = dialog.getAttribute("aria-labelledby");
  expect(labelledby).toBeTruthy();
  const title = document.getElementById(labelledby!);
  expect(title?.tagName).toBe("H2");
  expect(title?.textContent).toBe("Заголовок модалки");
});

// Клики оборачиваются в act: в React 16 пассивные эффекты (useEffect)
// для обновлений вне act отфлашиваются асинхронно, а act — синхронно.
test("Modal: при открытии фокус переходит внутрь диалога", () => {
  render(<TriggeredModal />);
  const trigger = screen.getByRole("button", { name: "Триггер" });
  trigger.focus();
  act(() => {
    trigger.click();
  });
  // Фокус должен оказаться внутри диалога (первый фокусируемый элемент).
  const dialog = screen.getByRole("dialog");
  expect(dialog.contains(document.activeElement)).toBe(true);
});

test("Modal: при закрытии фокус возвращается на триггер", () => {
  render(<TriggeredModal />);
  const trigger = screen.getByRole("button", { name: "Триггер" });
  trigger.focus();
  act(() => {
    trigger.click();
  });
  // Симулируем, что фокус внутри диалога (у контрола закрытия), и закрываем модалку.
  const closeButton = screen.getByRole("button", { name: "Закрыть" });
  closeButton.focus();
  act(() => {
    closeButton.click();
  });
  expect(document.activeElement).toBe(trigger);
});
