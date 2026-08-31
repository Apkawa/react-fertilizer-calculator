import React from "react";
import { REDUX_FORM_NAME } from "@/components/Calculator/constants";
import { Input } from "@/components/ui/Form";
import { createFormWrapper } from "@/test-utils/form";
import { renderApp } from "@/test-utils/render";

const FormWrapper = createFormWrapper(REDUX_FORM_NAME);

// label-проп служит и доступным именем инпута (aria-label):
// placeholder — лишь визуальная подсказка, для скринридера он именем не является.
test("components/ui/Form Input: label-проп — aria-label (placeholder сохраняется)", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Input name="solution_volume" label="Объем" />
    </FormWrapper>,
  );
  const input = container.querySelector("input") as HTMLInputElement | null;
  expect(input).not.toBeNull();
  expect(input?.getAttribute("aria-label")).toBe("Объем");
  expect(input?.getAttribute("placeholder")).toBe("Объем");
});

// Явный aria-label от коньюмера обязан дойти до нативного инпута, даже если
// label-проп не передан (иначе, например, дозы элементов в рецепте теряют имя:
// aria-label={undefined} после spread затирает явный атрибут).
test("components/ui/Form Input: явный aria-label не затирается пустым label", () => {
  const { container } = renderApp(
    <FormWrapper>
      <Input name="recipe.n" aria-label="Доза N" />
    </FormWrapper>,
  );
  const input = container.querySelector("input") as HTMLInputElement | null;
  expect(input).not.toBeNull();
  expect(input?.getAttribute("aria-label")).toBe("Доза N");
});
