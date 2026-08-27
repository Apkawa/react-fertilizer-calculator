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
];

test("registry: ровно 14 собственных иконок", () => {
  expect(Object.keys(icons).sort()).toEqual(expectedNames.sort());
});

test("registry: каждая иконка — React-компонент", () => {
  for (const name of expectedNames) {
    expect(typeof icons[name]).toBe("function");
  }
});
