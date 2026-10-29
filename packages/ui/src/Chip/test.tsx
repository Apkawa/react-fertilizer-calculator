// TDD, Stage 3 «Chip + ElementCell атомы» (red-фаза): атом Chip в пакете ещё нет —
// импорт из ./index падает, тесты красные. Здесь зафиксирован контракт API
// (макет apps/web-design: чанк баланса — borderless тон, чип элемента — тон
// --el-tint классом снаружи; тексты — единый цвет, css в jsdom не проверяем).
import { render } from "@testing-library/react";
import React from "react";
import { Chip } from "./index";

// Баланс-чанк (plain): два ряда — подпись label сверху, значение value под ней;
// корень — div с хуком data-ui="chip" (точка таргета схем).
test('Chip plain: корень несёт data-ui="chip", тексты label/value по порядку', () => {
  const { container } = render(<Chip label="ΔΣI" value="194.7" />);
  const chip = container.querySelector('[data-ui="chip"]') as HTMLElement;
  expect(chip).not.toBeNull();
  expect(chip.children.length).toBe(2);
  expect(chip.children[0].textContent).toBe("ΔΣI");
  expect(chip.children[1].textContent).toBe("194.7");
});

// Element-variant: тон задаётся классом элемента снаружи (className="el-k" →
// наследуемый --el-tint), корню — переданный className; тексты те же
// (имя/значение не красим по элементу — канон §5).
test('Chip element: variant="element" рендерит чип, className (тон) на корне', () => {
  const { container } = render(<Chip label="K" value="140" variant="element" className="el-k" />);
  const chip = container.querySelector('[data-ui="chip"]') as HTMLElement;
  expect(chip).not.toBeNull();
  expect(chip.className).toContain("el-k");
  expect(chip.children[0].textContent).toBe("K");
  expect(chip.children[1].textContent).toBe("140");
});

// Дельта — не контракт чипа (она у ElementCell); чип aria-free: ни role, ни
// aria-атрибутов на корне и внутри.
test("Chip: data-delta нет, aria-атрибуты отсутствуют (aria-free)", () => {
  const { container } = render(
    <Chip label="K:Ca" value="1.9" variant="element" className="el-k" />,
  );
  const chip = container.querySelector('[data-ui="chip"]') as HTMLElement;
  expect(chip).not.toBeNull();
  expect(chip.getAttribute("data-delta")).toBeNull();
  expect(chip.querySelector("[data-delta]")).toBeNull();
  expect(chip.getAttribute("role")).toBeNull();
  expect(chip.getAttribute("aria-label")).toBeNull();
});
