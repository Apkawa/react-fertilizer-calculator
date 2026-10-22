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

// Геометрия карточки: детерминированный короткий заголовок и короткий контент,
// чтобы ширина карточки определялась контентом, а не фиксированной шириной.
function GeometryModal() {
  return (
    <Modal
      title="Коротко"
      button={({ modal }) => (
        <button type="button" onClick={modal.open}>
          Геометрия
        </button>
      )}
      container={() => <div>текст</div>}
    />
  );
}

test("Modal: карточка по центру по горизонтали, ширина по контенту", async () => {
  const { screen } = mountBrowser(<GeometryModal />);
  const trigger = screen.getByRole("button", { name: "Геометрия" });
  await trigger.click();

  // Портальный диалог — ищем page-локатором (портал вне container)
  const dialog = page.getByRole("dialog");
  await expect.element(dialog).toBeVisible();
  // Геометрия карточки через getBoundingClientRect() (элемент [role="dialog"]);
  // в browser mode тест исполняется в chromium — document доступен напрямую
  const rect = document.querySelector('[role="dialog"]')!.getBoundingClientRect();
  const x = rect.x;
  const width = rect.width;
  // Центр карточки по X: left + width/2
  const centerX = x + width / 2;
  const midX = window.innerWidth / 2;

  // a) По центру по горизонтали: центр X в пределах ±8px от середины окна
  expect(
    Math.abs(centerX - midX),
    `центр X=${centerX.toFixed(1)}, середина окна=${midX.toFixed(1)}`,
  ).toBeLessThanOrEqual(8);

  // b) Ширина по контенту: короткая карточка уже 80% ширины окна
  expect(
    width,
    `ширина=${width.toFixed(1)}, 80% окна=${(window.innerWidth * 0.8).toFixed(1)}`,
  ).toBeLessThan(window.innerWidth * 0.8);
});
