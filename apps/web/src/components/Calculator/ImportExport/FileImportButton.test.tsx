// Доработка hover (после Stage 8): hover/клик import-кнопки должен попадать
// на <button> — tint из Button работает; невидимый file-инпут инертен для
// курсора (pointer-events none, tabIndex -1) и клик кнопки проксирует в
// input.click() — диалог файла открывается по жесту пользователя.
import { fireEvent, render } from "@testing-library/react";
import React, { type ChangeEvent } from "react";
import { FileImportButton } from "./FileImportButton";

test("FileImportButton: инпут инертен для курсора, клик кнопки проксирует в диалог", () => {
  const onChange = vi.fn((_e: ChangeEvent<HTMLInputElement>) => {});
  const { container } = render(
    <FileImportButton ariaLabel="Импорт рецептов" accept=".csv" onChange={onChange} />,
  );
  const button = container.querySelector("button") as HTMLButtonElement | null;
  const input = container.querySelector('input[type="file"]') as HTMLInputElement | null;
  expect(button).not.toBeNull();
  expect(input).not.toBeNull();
  // инпут не перехватывает курсор — hover и клик идут на кнопку
  expect(input?.style.pointerEvents).toBe("none");
  expect(input?.tabIndex).toBe(-1);
  // tint из Button не глушится utility-override
  expect(button?.className).not.toContain("hover:bg-transparent");
  // клик кнопки открывает диалог: прокси в input.click()
  const proxy = vi.fn();
  if (input) {
    input.click = proxy;
  }
  fireEvent.click(button as HTMLButtonElement);
  expect(proxy).toHaveBeenCalledTimes(1);
});
