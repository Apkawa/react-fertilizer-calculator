import { expect, test } from "@playwright/test";
import { trackConsoleErrors } from "../helpers";
import { addFertilizers, FERTILIZERS, resultItem } from "./shared";

// E2E: состояние сохраняется в localStorage (`reduxState`) — после reload
// результат расчёта и выбор удобрений на месте.

test("persistence: result survives page reload", async ({ page }) => {
  const errors = trackConsoleErrors(page);
  await page.goto("/#/");

  await addFertilizers(page, [FERTILIZERS[0], FERTILIZERS[1]]);
  await page.getByRole("button", { name: "Calculate" }).click();

  const item = resultItem(page, FERTILIZERS[0]);
  await expect(item).toBeVisible();

  await page.reload();
  await expect(resultItem(page, FERTILIZERS[0])).toBeVisible();

  expect(errors(), `console/page errors: ${errors().join("\n")}`).toEqual([]);
});
