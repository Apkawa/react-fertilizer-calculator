import { expect, test } from "@playwright/test";
import { FERTILIZERS, resultItem, selectFertilizers } from "./shared";
import { trackConsoleErrors } from "../helpers";

// E2E: главный сценарий — выбрать удобрения из библиотеки merged-карточки
// «Удобрения» (канон §3.1), посчитать раствор, увидеть результат.

test("calculator: select fertilizers, calculate, result appears", async ({ page }) => {
  const errors = trackConsoleErrors(page);

  await page.goto("/#/");
  await expect(page.getByText("Результат расчета").first()).toBeVisible();

  await selectFertilizers(page);
  // Membership: чекбокс ряда отмечен (toggleFertilizer, §3.1).
  for (const id of FERTILIZERS) {
    await expect(page.getByRole("checkbox", { name: `Выбрать ${id}` })).toBeChecked();
  }

  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(resultItem(page, FERTILIZERS[0])).toBeVisible();
  await expect(resultItem(page, FERTILIZERS[1])).toBeVisible();
  // Масса в строке результата: «N г» (§3.1/§5).
  await expect(resultItem(page, FERTILIZERS[0])).toContainText(/\d+(\.\d+)? г/);
  await expect(page.getByText("Выберите удобрения")).toHaveCount(0);

  expect(errors(), `console/page errors: ${errors().join("\n")}`).toEqual([]);
});
