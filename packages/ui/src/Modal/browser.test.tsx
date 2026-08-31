// Браузерный регрессионный тест Modal (vitest browser mode, chromium).
// Portal: ModalContainer рендерится в #modal-root (вне container) —
// диалог ищем page-локаторами уровня getByRole("dialog").
import React from "react";
import { expect, test } from "vitest";
import { page } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
import { Modal } from "./index";

// Реальный паттерн использования: триггер — button-колбэк, вызывающий modal.open()
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

test("Modal: открывается по триггеру, фокус внутри, закрывается кнопкой", async () => {
  const { screen } = mountBrowser(<TriggeredModal />);
  const trigger = screen.getByRole("button", { name: "Триггер" });
  await expect.element(trigger).toBeVisible();
  await trigger.click();

  // Портальный диалог: виден, с заголовком и контентом
  const dialog = page.getByRole("dialog");
  await expect.element(dialog).toBeVisible();
  await expect.element(dialog).toHaveAttribute("aria-modal", "true");
  const title = page.getByRole("heading", { name: "Заголовок модалки" });
  await expect.element(title).toBeVisible();
  await expect.element(page.getByText("контент модалки")).toBeVisible();

  // Фокус-менеджмент: при открытии фокус переходит внутрь диалога
  // (первый фокусируемый элемент — кнопка закрытия)
  const closeButton = page.getByRole("button", { name: "Закрыть" });
  await expect.element(closeButton).toHaveFocus();

  // Закрытие кнопкой: портал размонтируется
  await closeButton.click();
  await expect.element(dialog).not.toBeInTheDocument();
});

test("Modal: ARIA-снапшот базового состояния (закрыто — только триггер)", async () => {
  const { screen } = mountBrowser(<TriggeredModal />);
  await expect.element(screen.getByRole("button", { name: "Триггер" })).toMatchAriaSnapshot();
});
