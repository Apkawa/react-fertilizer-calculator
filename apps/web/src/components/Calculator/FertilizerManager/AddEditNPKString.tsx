import { parseProfileStringToNPK, stringifyProfile } from "@fertilizer/calculator/profile";
import type { NPKElements } from "@fertilizer/calculator/types";
import React, { type ChangeEvent, type FunctionComponent, useEffect, useState } from "react";
import { StyledInput } from "@/components/ui/Form";
import { useStore } from "@/store";

interface AddEditNPKStringProps {
  npk?: NPKElements;
  onChange?: (elements: NPKElements) => void;
}

export const AddEditNPKString: FunctionComponent<AddEditNPKStringProps> = (props) => {
  // Форма удобрения — глобальный стор (аналог useFormValues)
  const { composition_enable } = useStore((s) => s.fertilizerEdit);
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
    <div className="flex flex-col justify-center items-center w-full p-2">
      {/* biome-ignore lint/a11y/noLabelWithoutControl: пустой label — только вертикальный отступ; htmlFor/id прокидываются до DOM-инпута через обёртку */}
      <label style={{ textAlign: "center" }} htmlFor="npk-string"></label>
      <StyledInput
        id="npk-string"
        disabled={composition_enable}
        placeholder={'Быстрое редактирование в формате "NO3=10 P2O5=12 K=5"'}
        value={value}
        type="text"
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
    </div>
  );
};
