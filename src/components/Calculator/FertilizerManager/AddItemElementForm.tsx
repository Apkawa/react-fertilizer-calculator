import React, { type FunctionComponent } from "react";
import { Flex } from "rebass";
import { NPKOxides } from "@/calculator/constants";
import type { Elements } from "@/calculator/types";
import { Input } from "@/components/ui/ReduxForm/Input";
import { decimal } from "@/components/ui/ReduxForm/normalizers";

interface RecipeElementFormProps {
  name: keyof Elements;
  disabled?: boolean;
}

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
