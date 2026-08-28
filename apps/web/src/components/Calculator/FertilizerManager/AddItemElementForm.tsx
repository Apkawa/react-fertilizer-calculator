import { NPKOxides } from "@fertilizer/calculator/constants";
import type { Elements } from "@fertilizer/calculator/types";
import React, { type FunctionComponent } from "react";
import { Flex } from "rebass";
import { decimal, Input } from "@/components/ui/Form";

interface RecipeElementFormProps {
  name: keyof Elements;
  disabled?: boolean;
}

// Поле элемента в форме удобрения: значение по dot-path (npk.<name>) из глобального стора
export const AddItemElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const { name, disabled } = props;
  let displayName: string = name;
  if (Object.hasOwn(NPKOxides, name)) {
    displayName = NPKOxides[name] as string;
  }
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width="4rem">
      <label style={{ textAlign: "center" }} htmlFor={"npk-" + name}>
        {displayName}
      </label>
      <Input
        id={"npk-" + name}
        name={"npk." + name}
        type="number"
        min="0"
        max="100"
        autoComplete="off"
        width="3rem"
        style={{
          textAlign: "center",
        }}
        normalize={decimal}
        disabled={disabled}
      />
    </Flex>
  );
};
