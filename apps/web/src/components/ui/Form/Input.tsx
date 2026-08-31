import { Input as UiInput, type InputProps as UiInputProps } from "@fertilizer/ui";
import React, { type ChangeEvent, type CSSProperties, type FunctionComponent } from "react";
import { useFormField } from "@/store/use-form-field";

// Лёгасные пропы раскладки (старая дизайн-система), которые коньюмеры передают на поле формы:
// width/maxWidth/flex — обычные CSS-значения, marginRight — токен space-шкалы
interface LegacyLayout {
  width?: string;
  maxWidth?: string;
  flex?: number;
  marginRight?: number;
}

// space-шкала (px): индекс токена → пиксели (polaris: [0,4,8,16,32,64,128])
const SPACE_SCALE = [0, 4, 8, 16, 32, 64, 128];

const layoutStyle = (props: LegacyLayout & { style?: CSSProperties }): CSSProperties => {
  const { width, maxWidth, flex, marginRight, style } = props;
  return {
    width,
    maxWidth,
    flex,
    marginRight: marginRight === undefined ? undefined : `${SPACE_SCALE[marginRight] ?? 0}px`,
    ...style,
  };
};

export interface InputProps extends Omit<UiInputProps, "name" | "width">, LegacyLayout {
  /** Dot-path поля внутри текущей формы (FormProvider) */
  name: string;
  /** Преобразование значения при записи (аналог normalize redux-form) */
  normalize?: (value: string) => string | number;
  label?: string;
}

// «Сырой» инпут (для компонентов, не являющихся полями формы)
export const StyledInput: FunctionComponent<UiInputProps & LegacyLayout> = ({
  width,
  maxWidth,
  flex,
  marginRight,
  style,
  ...props
}) => <UiInput {...props} style={layoutStyle({ width, maxWidth, flex, marginRight, style })} />;

// Контролируемое текстовое/числовое поле: value из глобального стора, запись через FormProvider
export const Input: FunctionComponent<InputProps> = ({
  name,
  normalize,
  label,
  width,
  maxWidth,
  flex,
  marginRight,
  style,
  // Явный aria-label от коньюмера — в приоритете над label-пропом
  "aria-label": ariaLabel,
  ...props
}) => {
  const { value, setValue } = useFormField(name);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setValue(name, normalize ? normalize(raw) : raw);
  };
  return (
    <UiInput
      {...props}
      value={(value ?? "") as string | number}
      onChange={handleChange}
      lang="en-US"
      // Доступное имя: явный aria-label от коньюмера, иначе label-проп
      // (placeholder лишь визуальная подсказка, не имя)
      aria-label={ariaLabel ?? label}
      placeholder={props.placeholder || label}
      style={layoutStyle({ width, maxWidth, flex, marginRight, style })}
    />
  );
};
