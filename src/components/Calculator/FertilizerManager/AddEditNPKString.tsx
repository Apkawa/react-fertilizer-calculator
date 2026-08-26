import { Input } from "@rebass/forms";
import React, { type ChangeEvent, type FunctionComponent, useEffect, useState } from "react";
import { Flex } from "rebass";
import { parseProfileStringToNPK, stringifyProfile } from "@/calculator/profile";
import type { NPKElements } from "@/calculator/types";
import type { AddEditFormType } from "@/components/Calculator/FertilizerManager/types";
import { useFormName, useFormValues } from "@/hooks/ReduxForm";

interface AddEditNPKStringProps {
  npk?: NPKElements;
  onChange?: (elements: NPKElements) => void;
}

export const AddEditNPKString: FunctionComponent<AddEditNPKStringProps> = (props) => {
  const { composition_enable } = useFormValues<AddEditFormType>(useFormName())[0];
  const { npk, onChange } = props;
  // TODO разобрать useReducer вместо useState
  const [value, setValue] = useState<string | undefined>(npk && stringifyProfile(npk));
  const [isEditing, setEditing] = useState(false);

  useEffect(() => {
    if (!isEditing) {
      setValue(props.npk && stringifyProfile(props.npk));
    }
  }, [isEditing, props.npk]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const elements = parseProfileStringToNPK(e.target.value);
    console.log(elements);
    onChange && onChange(elements);
  };
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      width={"100%"}
      padding={2}
    >
      {/* biome-ignore lint/a11y/noLabelWithoutControl: пустой label — только вертикальный отступ; htmlFor/id прокидываются до DOM-инпута через обёртку */}
      <label style={{ textAlign: "center" }} htmlFor="npk-string"></label>
      <Input
        id="npk-string"
        disabled={composition_enable}
        placeholder={'Быстрое редактирование в формате "NO3=10 P2O5=12 K=5"'}
        value={value}
        type="string"
        autoComplete="off"
        style={{
          textAlign: "center",
        }}
        onChange={onChangeInput}
        onFocus={() => setEditing(true)}
        onBlur={() => {
          setEditing(false);
          setValue(props.npk && stringifyProfile(props.npk));
        }}
      />
    </Flex>
  );
};
