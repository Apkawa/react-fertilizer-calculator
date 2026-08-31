import React, { type FunctionComponent, useEffect, useState } from "react";
import { StyledInput } from "@/components/ui/Form";

interface RecipeElementFormProps {
  name: string;
  value: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
}

export const AddItemElementForm: FunctionComponent<RecipeElementFormProps> = (props) => {
  const { name, disabled } = props;
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value]);

  const onChange = (value: string) => {
    const v = parseFloat(value);
    setValue(v);
  };

  const onBlur = () => {
    props.onChange && props.onChange(value);
  };

  return (
    <div className="flex w-16 flex-col items-center justify-center">
      <label className="text-center" htmlFor={"element-" + name}>
        {name}
      </label>
      <StyledInput
        id={"element-" + name}
        type="number"
        step="0.1"
        min="0"
        max="100"
        autoComplete="off"
        width="3rem"
        value={value.toString()}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        style={{
          textAlign: "center",
        }}
      />
    </div>
  );
};
