import { cx, Label } from "@fertilizer/ui";
import React, { type FunctionComponent } from "react";
import { elementTintClass } from "@/components/Calculator/fertilizerRow";
import { decimal, NumberInput } from "@/components/ui/Form";

interface RecipeElementFormProps {
  name: string;
}

export const getRecipeFieldName = (name: string) => `recipe.${name}`;

// Ячейка дозы — канон макета (§3.4/§5): подпись над полем (field-label: 0.75rem,
// --muted, mb 0.25rem), тон элемента (.el-* из theme.css, реестр fertilizerRow)
// декоративен — задаёт только --el-tint и НЕ красит текст подписи (§5).
// Поле — ui NumberInput на всю ширину ячейки (спиннер ^/v по фокусу, Round 6);
// имя поля — aria-label («Доза <элемент>»).
export const RecipeElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const { name } = props;
  return (
    <div className="min-w-0">
      <Label className={cx("mb-1", elementTintClass(name))}>{name}</Label>
      <NumberInput
        name={getRecipeFieldName(name)}
        aria-label={`Доза ${name}`}
        type="number"
        step="0.001"
        min="0"
        max="999"
        autoComplete="off"
        normalize={decimal}
      />
    </div>
  );
};
