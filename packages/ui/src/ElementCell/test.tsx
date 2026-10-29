// TDD, Stage 3 «Chip + ElementCell атомы» (red-фаза): атом ElementCell ещё нет —
// импорт из ./index падает, тесты красные. Контракт API (макет apps/web-design
// §3.3): ряды name → value → delta по порядку; дельта БЕЗ символа «Δ» — только
// знаковое значение; знак дельты — стабильный контракт data-delta="plus|minus"
// на элементе дельты (окраска по знаку — css, в jsdom не проверяется).
import { render } from "@testing-library/react";
import React from "react";
import { ElementCell } from "./index";

// Дельта не передана → два ряда (имя, значение); корень с хуком data-ui.
test('ElementCell: корень data-ui="element-cell", порядок name → value', () => {
  const { container } = render(<ElementCell name="K" value="140" />);
  const cell = container.querySelector('[data-ui="element-cell"]') as HTMLElement;
  expect(cell).not.toBeNull();
  expect(cell.children.length).toBe(2);
  expect(cell.children[0].textContent).toBe("K");
  expect(cell.children[1].textContent).toBe("140");
});

// Дельта передана → третий ряд; текст дельты без «Δ» (канон §3.3).
test('ElementCell: delta — третий ряд, текст без символа "Δ"', () => {
  const { container } = render(<ElementCell name="Ca" value="120" delta="+35" />);
  const cell = container.querySelector('[data-ui="element-cell"]') as HTMLElement;
  expect(cell).not.toBeNull();
  expect(cell.children.length).toBe(3);
  expect(cell.children[2].textContent).toBe("+35");
  expect(cell.textContent).not.toContain("Δ");
});

// Знак «+» → data-delta="plus" на элементе дельты (в макете — --ok).
test('ElementCell: "+…" → data-delta="plus"', () => {
  const { container } = render(<ElementCell name="Ca" value="120" delta="+0.02" />);
  expect(container.querySelector('[data-delta="plus"]')?.textContent).toBe("+0.02");
});

// Знак «−» (unicode U+2212) → data-delta="minus" (в макете — --deficit).
test('ElementCell: "−…" (U+2212) → data-delta="minus"', () => {
  const { container } = render(<ElementCell name="K" value="140" delta="−0.10" />);
  expect(container.querySelector('[data-delta="minus"]')?.textContent).toBe("−0.10");
});

// ASCII "-" трактуется тем же знаком: минус (юзер-ввод в форме — ascii).
test('ElementCell: ascii "-…" → data-delta="minus"', () => {
  const { container } = render(<ElementCell name="K" value="140" delta="-0.10" />);
  expect(container.querySelector('[data-delta="minus"]')?.textContent).toBe("-0.10");
});

// «0» — нейтральная дельта (--muted по канону): ряда три, но знака нет —
// атрибут data-delta отсутствует; без delta атрибута тоже нет.
test('ElementCell: delta="0" и отсутствие delta → data-delta нет', () => {
  const { container: zero } = render(<ElementCell name="Mg" value="36" delta="0" />);
  const zeroCell = zero.querySelector('[data-ui="element-cell"]') as HTMLElement;
  expect(zeroCell.children.length).toBe(3);
  expect(zeroCell.children[2].textContent).toBe("0");
  expect(zero.querySelector("[data-delta]")).toBeNull();

  const { container: none } = render(<ElementCell name="Fe" value="1.4" />);
  expect(none.querySelector("[data-delta]")).toBeNull();
});
