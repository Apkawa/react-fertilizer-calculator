import { within } from "@testing-library/react";
import React from "react";
import { useStore } from "@/store";
import { renderApp } from "@/test-utils/render";
import { Element, SelectedListItem } from "./SelectedListItem";

// Элемент (чип) используется и в списке удобрений, и в блоке «Результат расчета»:
// text-black — только при наличии фонового цвета (ELEMENT_BG);
// без фона (Cl и микроэлементы) текст наследует цвет темы, иначе в тёмной теме
// черный текст на прозрачном фоне карточки не читается.
const chipEl = (name: Parameters<typeof Element>[0]["name"]) => {
  const { container } = renderApp(<Element name={name} value={1} />);
  return container.firstChild as HTMLElement;
};

test("components/Calculator/FertilizerSelect/Element: чип с фоном (NO3) — text-black", () => {
  const chip = chipEl("NO3");
  expect(chip.className).toContain("text-black");
}, 15000);

test("components/Calculator/FertilizerSelect/Element: чип без фона (Cl) — без text-black (цвет темы)", () => {
  const chip = chipEl("Cl");
  expect(chip.className).not.toContain("text-black");
}, 15000);

// a11y (stage 2): кнопка удаления ряда — настоящая кнопка с доступным именем
// (ранее icon-only close без имени — axe button-name).
test("components/Calculator/FertilizerSelect/SelectedListItem: кнопка удаления имеет имя", () => {
  const fertilizer = useStore.getState().calculator.fertilizers[0];
  const { container } = renderApp(<SelectedListItem item={fertilizer} onRemove={() => {}} />);
  const button = within(container).getByRole("button", { name: "Удалить" });
  expect(button).not.toBeNull();
}, 15000);
