import type { Page } from "@playwright/test";

// Общие вещи для e2e сценариев калькулятора.

export const FERTILIZERS = [
  "Нитрат аммония (NH4NO3)",
  "Нитрат калия (KNO3)",
  "Монофосфат калия (KH2PO4)",
];

// Чистая страница (нет localStorage): расчёт не запустится с пустым выбором
// удобрений (guard стора «Выберите удобрения») — сначала отмечаем ряды
// библиотеки merged-карточки «Удобрения» (канон §3.1): чекбокс
// «Выбрать <id>» — membership через toggleFertilizer.
export async function selectFertilizers(page: Page, ids: string[] = FERTILIZERS) {
  for (const id of ids) {
    await page.getByRole("checkbox", { name: `Выбрать ${id}` }).check();
  }
}

export function resultItem(page: Page, fertilizerId: string) {
  // Список результата (ResultFertilizerList): <li>{id} … {вес} г …</li>;
  // других <li> с таким текстом нет.
  // Локейтор оставлен осознанно (не role-based): Chrome не даёт этим <ul>/<li>
  // роли list/listitem в a11y-дереве (list-style: none из preflight Tailwind),
  // поэтому getByRole("listitem") их не находит, а доступное имя пункта
  // динамическое (вес из расчёта) — устойчивого имени для name-совпадения нет.
  return page.locator("li").filter({ hasText: fertilizerId }).first();
}
