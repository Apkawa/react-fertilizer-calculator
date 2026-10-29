import { MACRO_ELEMENT_NAMES, MICRO_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { getEmptyElements, getNPKDetailInfo } from "@fertilizer/calculator/helpers";
import { within } from "@testing-library/react";
import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { defaultFertilizers } from "@/components/Calculator/constants/fertilizers";
import { ELEMENT_TINT_CLASS } from "@/components/Calculator/fertilizerRow";
import { useStore } from "@/store";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";
import { calculateNow, resetStore, setFormField } from "@/test-utils/state";
import { round } from "@/utils";
import { Result } from "./Result";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

beforeEach(resetStore);

// Смоук: блок результата рендерится. Имя формы — настоящее:
// Result деструктурирует getFormValues(REDUX_FORM_NAME) и падает
// без зарегистрированной формы.
test("components/Calculator/Result smoke: блок результата рендерится", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  expect(container.textContent).toContain("Результат расчета");
}, 15000);

// a11y (stage 2): кнопки результата адресуются по доступному имени
// («Отправить на миксер» — иконка + подпись, «Сохранить комплекс» —
// появляется после расчета, дефолт стора — без результата).
test("components/Calculator/Result: кнопки имеют доступные имена", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  expect(within(container).getByRole("button", { name: "Отправить на миксер" })).not.toBeNull();
  // Сохранение комплекса — только когда есть результат (дефолт стора: null)
  expect(within(container).queryByRole("button", { name: "Сохранить комплекс" })).toBeNull();
}, 15000);

// Ряды элементов (Stage 6C, канон §3.3): СЕТКА 1 ряд × 8 колонок на ЛЮБОМ
// экране — «grid grid-cols-8» без responsive-вариантов; компакт ≤799px — в
// CSS ElementCell (jsdom не применяет media, поэтому ассерт — классы ряда и
// количество ячеек). 8 макро + 8 микро ячеек всегда; тон .el-* из реестра 6B.
test("components/Calculator/Result: ряды элементов — grid 1×8, 16 ячеек с тон-классами", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  const cells = [...container.querySelectorAll('[data-ui="element-cell"]')] as HTMLElement[];
  expect(cells).toHaveLength(MACRO_ELEMENT_NAMES.length + MICRO_ELEMENT_NAMES.length);

  const rows = [...container.querySelectorAll(".grid")] as HTMLElement[];
  expect(rows).toHaveLength(2);
  for (const row of rows) {
    expect(row.className).toContain("grid-cols-8");
    // Компакт-тир делает ElementCell (CSS ≤799px), ряд не перестроится никогда.
    expect(row.className).not.toContain("min-[800px]");
    expect(row.children).toHaveLength(8);
  }
  // Макро — тон по реестру (§3.2), микро — общий el-micro; текст не красится.
  const macro = rows[0].children;
  for (const [i, name] of MACRO_ELEMENT_NAMES.entries()) {
    expect(macro[i].className, `тон ячейки ${name}`).toContain(ELEMENT_TINT_CLASS[name]);
  }
  const micro = rows[1].children;
  for (const cell of micro) {
    expect(cell.className).toContain("el-micro");
  }
}, 15000);

// Ряд баланса (Stage 6C, канон §3.2): Chip plain ×6 в flex-nowrap — всегда
// одна строка. Значения — из ДАННЫХ расчёта (getNPKDetailInfo по элементам
// дефолтного стора), не из литералов макета; K:Mg добавлен из данных (в
// макете его нет). Подпись «ΔΣ I» — маркер App.test (пробел сохранён).
test("components/Calculator/Result: ряд баланса — 6 чипов с данными расчёта, flex-nowrap", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  const balance = getNPKDetailInfo(getEmptyElements());
  const expected: Array<[string, number]> = [
    ["ΔΣ I", balance.ion_balance],
    ["EC", balance.EC],
    ["%NH4", round(balance.ratio.NH4.NO3 * 100, 1)],
    ["K:N", balance.ratio.K.N],
    ["K:Ca", balance.ratio.K.Ca],
    ["K:Mg", balance.ratio.K.Mg],
  ];
  const chips = [...container.querySelectorAll('[data-ui="chip"]')] as HTMLElement[];
  expect(chips).toHaveLength(expected.length);
  for (const [i, [label, value]] of expected.entries()) {
    const chip = chips[i];
    expect(chip.firstElementChild?.textContent, `подпись чипа ${i}`).toBe(label);
    expect(chip.lastElementChild?.textContent, `значение чипа ${i}`).toBe(String(value));
  }
  // Ряд чипов — flex-nowrap (§3.2): чипы не переносится на узком экране.
  const row = chips[0]?.parentElement as HTMLElement;
  expect(row.className).toContain("flex");
  expect(row.className).toContain("flex-nowrap");
}, 15000);

// Заголовок карточки — канон (§5): Heading h2 card-title без text-base
// (легасный override перебивал канон 1.125rem/600).
test("components/Calculator/Result: заголовок — канон card-title без text-base", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  const heading = within(container).getByRole("heading", { name: "Результат расчета" });
  expect(heading.tagName).toBe("H2");
  expect(heading.className).not.toContain("text-base");
}, 15000);

// Save-кнопка (Stage 6C, канон §3.1): ui Button канон — tint от --primary,
// НИКАКОГО primary-fill: легасный backgroundColor={"primary"} удалён
// (bg-класс от переходного alias'а — снят в Stage 8). onClick
// модалки сохранён, доступное имя сохранено.
test("components/Calculator/Result: save-кнопка — канон Button без primary-фона", () => {
  setFormField("fertilizers", defaultFertilizers.slice(0, 2));
  calculateNow();
  expect(useStore.getState().calculator.result).not.toBeNull();

  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  const save = within(container).getByRole("button", { name: "Сохранить комплекс" });
  expect(save.getAttribute("data-ui")).toBe("button");
  expect(save.className).not.toContain("bg-");
  expect(save.style.backgroundColor).toBe("");
}, 20000);

// Список удобрений результата — семантический список ul/li (вывод расчёта,
// канон §3.5); e2e-локейтор resultItem опирается на li — div-строки (Stage 6)
// ломали e2e-сценарий, семантика списка обязательна.
test("components/Calculator/Result: список удобрений — семантические ul/li", () => {
  setFormField("fertilizers", defaultFertilizers.slice(0, 2));
  calculateNow();

  const { container } = renderApp(
    <FormWrapper>
      <Result />
    </FormWrapper>,
  );
  const rows = [...container.querySelectorAll("ul li")] as HTMLElement[];
  expect(rows.length).toBeGreaterThanOrEqual(1);
  expect(rows.map((row) => row.textContent).join(" ")).toContain(defaultFertilizers[0].id);
}, 20000);
