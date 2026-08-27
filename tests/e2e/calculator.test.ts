import { expect, test } from "@playwright/test";
import { addFertilizers, FERTILIZERS, resultItem } from "./shared";
import { trackConsoleErrors } from "../helpers";

// E2E: главный сценарий — добавить удобрения, посчитать раствор, увидеть результат.

test("calculator: add fertilizers, calculate, result appears", async ({ page }) => {
  const errors = trackConsoleErrors(page);

  await page.goto("/#/");
  await expect(page.getByText("Результат расчета").first()).toBeVisible();

  await addFertilizers(page);
  // Добавленное удобрение появилось в списке выбора (Card, не li).
  // .first(): текст дублируется — в списке выбора и в закрытом дропдауне.
  await expect(
    page.getByText(FERTILIZERS[0], { exact: true }).first(),
  ).toBeVisible();

  await page.getByRole("button", { name: "Calculate" }).click();

  await expect(resultItem(page, FERTILIZERS[0])).toBeVisible();
  await expect(resultItem(page, FERTILIZERS[1])).toBeVisible();
  await expect(page.getByText("Need fertilizers!")).toHaveCount(0);

  expect(errors(), `console/page errors: ${errors().join("\n")}`).toEqual([]);
});
