import React, { type FunctionComponent } from "react";
import { Input, number } from "@/components/ui/Form";

interface RecipeElementFormProps {
  name: string;
}

export const getRecipeFieldName = (name: string) => `recipe.${name}`;

export const RecipeElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const { name } = props;
  return (
    <div className="flex max-w-12 flex-col items-center justify-center">
      <div style={{ textAlign: "center" }}>{name}</div>
      <Input
        name={getRecipeFieldName(name)}
        aria-label={`Доза ${name}`}
        type="number"
        step="0.001"
        min="0"
        max="999"
        autoComplete="off"
        normalize={number}
        maxWidth="3rem"
        style={{
          textAlign: "center",
        }}
      />
    </div>
  );
};
