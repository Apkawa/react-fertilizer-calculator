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
  // Дропдаун «добавить удобрение» — combobox по доступному имени
  // (stage 4: label-проп → aria-label триггера).
  const trigger = page.getByRole("combobox", { name: "Добавить удобрение" });
  // Список открывает шеврон справа (клик по самому input не открывает).
  // Шеврон — кнопка «Открыть список» (закрытое состояние), но она не потомок
  // combobox, а сидит рядом с ним в ряду триггера; и на странице таких
  // кнопок две («Добавить удобрение» и «Рецепт») — поэтому ищем в строке
  // комбобокса (один шаг вверх: `..` у css-движка Playwright).
  await trigger.locator("..").getByRole("button", { name: "Открыть список" }).click();

  for (const id of ids) {
    // Рядок дропдауна — role="option" (stage 4) с доступным именем по тексту
    // удобрения; кнопка «Добавить» в том же ряду — role-based.
    const row = page.getByRole("option", { name: id });
    await row.getByRole("button", { name: "Добавить" }).click();
  }
}

export function resultItem(page: Page, fertilizerId: string) {
  // Список результата: <li>{вес}г … {id}</li>; других <li> с таким текстом нет.
  // Локейтор оставлен осознанно (не role-based): Chrome не даёт этим <ul>/<li>
  // роли list/listitem в a11y-дереве (list-style: none из preflight Tailwind),
  // поэтому getByRole("listitem") их не находит, а доступное имя пункта
  // динамическое (вес из расчёта) — устойчивого имени для name-совпадения нет.
  return page.locator("li").filter({ hasText: fertilizerId }).first();
}
