// Браузерный регрессионный тест NumberInput (vitest browser mode, chromium).
// theme.css — токены темы (:root), без них компонентные var(--...) не
// резолвятся и стиль кнопки (tint-фон от --primary) проверялся бы на пустом значении.
import "../theme.css";
import React, { useState } from "react";
import { expect, test } from "vitest";
import { userEvent } from "vitest/browser";
import { mountBrowser } from "../browser-test-utils";
import { NumberInput } from "./index";

// Контролируемая обёртка: onChange пишет в стор родителя — как в реальном приложении
// paddingTop — чтобы ^ над полем оставался в viewport тестовой страницы
// (без отступа кнопка за верхним краем — клик недоступен)
function Wrapper() {
  const [v, setV] = useState(1);
  return (
    <div style={{ paddingTop: "6rem" }}>
      <NumberInput
        aria-label="Число"
        value={v}
        step={1}
        onChange={(e) => setV(Number(e.target.value))}
      />
    </div>
  );
}

test("NumberInput: значение рендерится, ввод меняет его", async () => {
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  await expect.element(input).toBeVisible();
  await expect.element(input).toHaveValue("1");
  await input.fill("5");
  await expect.element(input).toHaveValue("5");
});

test("NumberInput: спиннер по фокусу, кнопка вверх увеличивает на step", async () => {
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  // Кнопки спиннера — условный рендер (showBtn по фокусу), без CSS:
  // до фокуса их нет в DOM, после фокуса — появляются
  // Клик по полю = реальный фокус (у Locator нет фокус-метода, есть CDP-клик)
  await userEvent.click(input);
  const up = screen.getByRole("button", { name: "увеличить" });
  await expect.element(up).toBeVisible();
  await up.click();
  await expect.element(input).toHaveValue("2");
});

// Косметическая правка (Round 6): кнопки спиннера — по горизонтали по центру
// поля, стоят над/под инпутом касанием своих краёв к его границам (без
// перекрытия), стиль — канон Button (composes), height 2.5rem; фон — tint
// от primary поверх --card. Раньше: съезжали к краю block-обёртки; затем
// был «белый инпут», потом transparent-подложка Button просвечивал ячейки.
test("NumberInput: спиннер — кнопки центрированы над/под полем, стиль как у Button", async () => {
  const { screen } = mountBrowser(<Wrapper />);
  const input = screen.getByRole("textbox");
  await userEvent.click(input);

  const rects = (name: string) => {
    // Тест исполняется в браузере — прямой DOM доступ доступен
    const el = Array.from(document.querySelectorAll("button")).find(
      (b) => b.getAttribute("aria-label") === name,
    ) as HTMLElement;
    const b = el.getBoundingClientRect();
    const inp = el.parentElement?.querySelector("input") as HTMLInputElement;
    const i = inp.getBoundingClientRect();
    return {
      cx: b.left + b.width / 2,
      icx: i.left + i.width / 2,
      top: b.top,
      bottom: b.bottom,
      height: b.height,
      iTop: i.top,
      iBottom: i.bottom,
      bg: getComputedStyle(el).backgroundColor,
    };
  };

  const up = await rects("увеличить");
  const down = await rects("уменьшить");
  // Центр кнопки совпадает с центром поля (±2px)
  expect(Math.abs(up.cx - up.icx)).toBeLessThan(2);
  expect(Math.abs(down.cx - down.icx)).toBeLessThan(2);
  // ^ стоит над полем и касается его верхней границы, v — нижней
  expect(up.top).toBeLessThan(up.iTop);
  expect(Math.abs(up.bottom - up.iTop)).toBeLessThan(2);
  expect(down.bottom).toBeGreaterThan(down.iBottom);
  expect(Math.abs(down.top - down.iBottom)).toBeLessThan(2);
  // Стиль — канон Button (composes): height 2.5rem = 40px; фон — tint от
  // --primary поверх --card (непрозрачный rgb): кнопка перекрывает соседние
  // ячейки, transparent-подложка Button просвечивает их содержимое.
  expect(up.height).toBe(40);
  expect(down.height).toBe(40);
  // Непрозрачный: ни rgba(), ни альфа-канала в color(srgb … / a)
  expect(up.bg).not.toMatch(/rgba\(|\/ ?0?\.\d+/);
});

test("NumberInput: ARIA-снапшот базового состояния", async () => {
  const { screen } = mountBrowser(<NumberInput aria-label="Число" value={1} onChange={() => {}} />);
  await expect.element(screen.getByRole("textbox")).toMatchAriaSnapshot();
});
