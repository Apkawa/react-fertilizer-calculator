import { fireEvent, within } from "@testing-library/react";
import React from "react";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { ROW_HANDLE_SELECTOR } from "@/components/Calculator/fertilizerRow";
import { renderApp } from "@/test-utils/render";
import { resetStore, seedResult, setFormField } from "@/test-utils/state";
import { List as FertilizerManager } from "./List";

beforeEach(resetStore);

// Смоук: merged-карточка «Удобрения» (канон §3.1) — менеджер над библиотекой
// с шапкой plus + eye-toggle — рендерится без исключений.
test("components/Calculator/FertilizerManager smoke: карточка «Удобрения» рендерится", () => {
  const { container } = renderApp(<FertilizerManager />);
  expect(within(container).getByRole("heading", { name: "Удобрения" })).not.toBeNull();
}, 15000);

// a11y (stage 2 + т. заказчика): icon-кнопки шапки merged-карточки имеют
// доступные имена (getByRole("button", { name }) — без хрупких DOM-локейторов).
// Порядок шапки (§3.1): plus сразу за заголовком, затем eye-toggle. Импорт/
// экспорт/сброс библиотеки — в карточке «Импорт/Экспорт» (пин в Calculator.test).
test("components/Calculator/FertilizerManager: кнопки шапки имеют доступные имена", () => {
  const { container } = renderApp(<FertilizerManager />);
  const names = ["Добавить удобрение", "Скрыть неактивные удобрения"];
  for (const name of names) {
    expect(within(container).getByRole("button", { name }), `кнопка «${name}»`).not.toBeNull();
  }
  const buttons = names.map((name) => within(container).getByRole("button", { name }));
  for (let i = 1; i < buttons.length; i++) {
    expect(
      buttons[i - 1].compareDocumentPosition(buttons[i]) & Node.DOCUMENT_POSITION_FOLLOWING,
      `«${names[i]}» после «${names[i - 1]}»`,
    ).not.toBe(0);
  }
}, 15000);

// Eye-toggle (т. заказчика): закрытое состояние прячет неактивные ряды —
// класс hide-inactive на контейнере sortable (display:none по CSS на
// .is-inactive); кнопка переключается на «Показать все удобрения».
test("components/Calculator/FertilizerManager: eye-toggle переключает режим списка", () => {
  const { container } = renderApp(<FertilizerManager />);
  expect(container.querySelector(".hide-inactive")).toBeNull();

  fireEvent.click(within(container).getByRole("button", { name: "Скрыть неактивные удобрения" }));
  expect(container.querySelector(".hide-inactive")).not.toBeNull();
  expect(within(container).getByRole("button", { name: "Показать все удобрения" })).not.toBeNull();

  fireEvent.click(within(container).getByRole("button", { name: "Показать все удобрения" }));
  expect(container.querySelector(".hide-inactive")).toBeNull();
}, 15000);

// Ряд merged-карточки (§3.1): grip → чекбокс «Выбрать "<id>"» → имя → масса
// (только отмеченный ряд при наличии result) → edit → delete; edit СЛЕВА от
// delete. Подложки кнопок без хардкода (danger — только hover, .fert-del).
const rowFor = (container: HTMLElement, id: string): HTMLElement => {
  const checkbox = container.querySelector(
    `input[data-ui="checkbox"][aria-label^="Выбрать"][aria-label*="${id}"]`,
  );
  if (checkbox === null) throw new Error(`чекбокс «Выбрать "${id}"» не найден`);
  return checkbox.closest('[data-ui="card"]') as HTMLElement;
};

const rowControls = (row: HTMLElement): string[] =>
  [...row.querySelectorAll('[data-ui="button"], [data-ui="checkbox"]')].map(
    (c) => c.getAttribute("aria-label") ?? "",
  );

// Отмеченный ряд: чекбокс checked, масса из result по id — «8.2 г»
// (пробел перед «г», канон .fert-weight), edit перед delete, не is-inactive.
test("FertilizerManager: отмеченный ряд — чекбокс, масса «N г», edit перед delete", () => {
  const id = "Нитрат аммония (NH4NO3)";
  const selected = defaultFertilizers.find(
    (f) => f.id === id,
  ) as (typeof defaultFertilizers)[number];
  setFormField("fertilizers", [selected]);
  seedResult([{ id, weight: 8.2, base_weight: 8.2 }]);

  const { container } = renderApp(<FertilizerManager />);
  const row = rowFor(container, id);

  const checkbox = within(row).getByRole("checkbox", {
    name: /^Выбрать .*Нитрат аммония \(NH4NO3\)$/,
  });
  expect(checkbox).toBeChecked();
  expect(row.className).not.toContain("is-inactive");

  expect(rowControls(row)).toEqual([
    "Переместить",
    expect.stringMatching(/^Выбрать .*Нитрат аммония \(NH4NO3\)$/),
    "Редактировать",
    "Удалить удобрение",
  ]);

  const grip = row.querySelector(ROW_HANDLE_SELECTOR) as HTMLElement;
  expect(grip.className).toContain("fert-grip");
  // Грип канона §3.5 (1.5rem×2.5rem) — инлайн width перебивает icon-only
  // квадратный дефолт IconButton (round 9).
  expect(grip.style.width).toBe("1.5rem");
  // Тот же стабильный локейтор, что и DnD handle ReactSortable (List).
  expect(row.querySelectorAll(ROW_HANDLE_SELECTOR).length, "ровно одна рукоятка ряда").toBe(1);

  // Масса из result.fertilizers по id (§3.1): «8.2 г» — пробел перед «г»
  expect(row.textContent).toContain("8.2 г");

  const del = row.querySelector('[aria-label="Удалить удобрение"]') as HTMLElement;
  expect(del.className).toContain("fert-del");
  expect(del.style.backgroundColor).toBe("");
  expect(del.className).not.toContain("bg-[");

  // Состав — чипы с тон-классом .el-* (§3.2), подложка не хардкод
  const chips = [...row.querySelectorAll('[data-ui="chip"]')] as HTMLElement[];
  expect(chips.length).toBeGreaterThan(0);
  for (const chip of chips) {
    expect(chip.className).toMatch(/el-(no3|nh4|p|k|ca|mg|s|cl|micro)/);
    expect(chip.style.backgroundColor).toBe("");
  }
  // Порядок: состав идёт раньше кнопок действий (id → chips → edit → delete)
  const edit = row.querySelector('[aria-label="Редактировать"]') as HTMLElement;
  expect(
    chips[0].compareDocumentPosition(edit) & Node.DOCUMENT_POSITION_FOLLOWING,
    "кнопки после состава",
  ).not.toBe(0);
}, 15000);

// Снятый ряд (§3.1): .is-inactive, чекбокс снят; масса НЕ показывается даже
// при наличии result по id; кнопки те же, тот же порядок (edit слева от del).
test("FertilizerManager: снятый ряд — is-inactive, без массы", () => {
  const checkedId = "Нитрат аммония (NH4NO3)";
  const uncheckedId = "Сульфат магния (MgSO4*7H2O)";
  const selected = defaultFertilizers.find(
    (f) => f.id === checkedId,
  ) as (typeof defaultFertilizers)[number];
  setFormField("fertilizers", [selected]);
  // Масса есть в result и для снятого id — снятый ряд не должен её показать
  seedResult([
    { id: checkedId, weight: 8.2, base_weight: 8.2 },
    { id: uncheckedId, weight: 5.5, base_weight: 5.5 },
  ]);

  const { container } = renderApp(<FertilizerManager />);
  const row = rowFor(container, uncheckedId);

  const checkbox = within(row).getByRole("checkbox", { name: /^Выбрать .*Сульфат магния/ });
  expect(checkbox).not.toBeChecked();
  expect(row.className).toContain("is-inactive");
  expect(row.textContent).not.toContain("5.5 г");

  expect(rowControls(row)).toEqual([
    "Переместить",
    expect.stringMatching(/^Выбрать .*Сульфат магния/),
    "Редактировать",
    "Удалить удобрение",
  ]);
}, 15000);
