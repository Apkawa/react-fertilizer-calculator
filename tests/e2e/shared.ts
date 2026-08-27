import type { Page } from "@playwright/test";

// Общие вещи для e2e сценариев калькулятора.

export const FERTILIZERS = [
  "Нитрат аммония (NH4NO3)",
  "Нитрат калия (KNO3)",
  "Монофосфат калия (KH2PO4)",
];

// Чистая страница (нет localStorage): расчёт не запустится с пустым выбором
// удобрений (сaga бросит «Need fertilizers!») — сначала добавляем их дропдауном.
export async function addFertilizers(page: Page, ids: string[] = FERTILIZERS) {
  // Дропдаун «добавить удобрение» — первый текстовый input страницы
  // (FertilizerSelect идёт до всех остальных форм).
  const input = page.locator('input[type="text"]').first();
  // Список открывает шеврон справа (клик по самому input не открывает).
  await input.locator("xpath=..").locator("svg").click();

  for (const id of ids) {
    // Рядок дропдауна: <div>{id}</div> + кнопка «+» в том же flex-ряде.
    // .first() — дропдаун в DOM раньше списка добавленных (SelectedList).
    const item = page.getByText(id, { exact: true }).first();
    await item.locator("xpath=ancestor::div[1]//button").click();
  }
}

export function resultItem(page: Page, fertilizerId: string) {
  // Список результата: <li>{вес}г … {id}</li>; других <li> с таким текстом нет.
  return page.locator("li").filter({ hasText: fertilizerId }).first();
}
