import type { CalculateResult, FertilizerWeights } from "@fertilizer/calculator";
import { type FERTILIZER_ELEMENT_NAMES, NPKOxides } from "@fertilizer/calculator/constants";

// Реестр тон-классов состава (guideline §3.2–3.3): имя элемента → класс .el-*
// из theme.css. Класс задаёт ТОЛЬКО --el-tint: тон декоративен (подложка/рамка
// чипа или ячейки), текст по элементу НЕ красится (§5). Никаких hex-литералов —
// тон берётся из темы/схемы (§4.4, Stage 8).
export const ELEMENT_TINT_CLASS: Record<FERTILIZER_ELEMENT_NAMES, string> = {
  NO3: "el-no3",
  NH4: "el-nh4",
  P: "el-p",
  K: "el-k",
  Ca: "el-ca",
  Mg: "el-mg",
  S: "el-s",
  Cl: "el-cl",
  // Микро (§3.2): общий тон el-micro (в theme.css он == el-s).
  Fe: "el-micro",
  Mn: "el-micro",
  B: "el-micro",
  Zn: "el-micro",
  Cu: "el-micro",
  Mo: "el-micro",
  Co: "el-micro",
  Si: "el-micro",
};

// Тон-класс по имени элемента: реестр выше; для неизвестного имени — нейтральный
// el-micro (текст всё равно var(--text)).
export const elementTintClass = (name: string): string =>
  Object.hasOwn(ELEMENT_TINT_CLASS, name)
    ? ELEMENT_TINT_CLASS[name as FERTILIZER_ELEMENT_NAMES]
    : "el-micro";

// Подпись элемента для отображения: канон — оксидные имена (P2O5, K2O, CaO, MgO).
export const elementDisplayName = (name: string): string =>
  Object.hasOwn(NPKOxides, name) ? NPKOxides[name] : name;

// Стабильный локейтор рукоятки ряда (§3.5 «Переместить»): CSS-module имена
// хешаются, aria-имя — нет. Используется как селектор DnD handle (Sortable)
// и как точка проверки в тестах.
export const ROW_HANDLE_SELECTOR = '[aria-label="Переместить"]';

// Вес удобрения из результата расчёта по id (merged-карточка FertilizerManager):
// join result.fertilizers по id; нет результата/веса — undefined.
export const weightForId = (
  result: CalculateResult | null | undefined,
  id: string,
): FertilizerWeights | undefined => (result?.fertilizers || []).find((f) => f.id === id);
