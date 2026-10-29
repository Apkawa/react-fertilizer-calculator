import { type IconName, icons } from "../registry";

const expectedNames: IconName[] = [
  "plus",
  "trash",
  "edit",
  "import",
  "export",
  "save",
  "restart",
  "broom",
  "tune",
  "menu",
  "close",
  "sun",
  "moon",
  "chevron-down",
  // Монитор — режим темы «Система» (redesign §5); grip — drag-handle ряда удобрений.
  // `chevron` не добавляем: уголок вниз уже есть как `chevron-down`.
  "monitor",
  "grip",
  // Toggle фильтра неактивных рядов в карточке «Удобрения» (т. заказчика).
  "eye",
  "eye-off",
];

test("registry: ровно 18 собственных иконок", () => {
  expect(Object.keys(icons).sort()).toEqual(expectedNames.sort());
});

test("registry: каждая иконка — React-компонент", () => {
  for (const name of expectedNames) {
    expect(typeof icons[name]).toBe("function");
  }
});
