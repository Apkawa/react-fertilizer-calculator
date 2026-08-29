import React, {
  type ChangeEvent,
  type CSSProperties,
  type FocusEvent,
  type InputHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { cx } from "./cx";
import { countDecimals, round } from "./number-utils";
import { inputClass, numberInputWrapperClass, spinnerButtonClass } from "./styles.css";

interface Size {
  width: number;
  height: number;
}

// Событие изменения значения: числовой инпут (поле) и кнопки спиннера.
// value — string из поля ввода, number из кнопки спиннера
export interface NumberInputChangeEvent {
  target: { value: string | number };
}

export interface NumberInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "step"> {
  value?: number | string;
  step?: number | string;
  /** CSS max-width (legacy-проп `maxWidth` из старой дизайн-системы) */
  maxWidth?: string | number;
  onChange?: (event: NumberInputChangeEvent) => void;
}

// Числовой инпут со спиннером (портирован из легасного виджета числового поля):
// кнопки ^/v показываются по фокусу и двигают значение на step
export const NumberInput = (props: NumberInputProps) => {
  const {
    name,
    value: propsValue,
    step,
    className,
    onChange,
    maxWidth,
    style,
    ...inputProps
  } = props;
  const stepValue = typeof step === "number" ? step : parseFloat(step || "1");
  const precision = countDecimals(stepValue);
  const [value, setValue] = useState(propsValue);
  const [showBtn, setShowBtn] = useState(false);
  const [inputSize, setInputSize] = useState<Size | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const upButtonRef = useRef<HTMLButtonElement | null>(null);
  const downButtonRef = useRef<HTMLButtonElement | null>(null);

  const onFocusHandler = () => {
    setShowBtn(true);
  };
  const onBlurHandler = (e: FocusEvent) => {
    const related = e.relatedTarget as HTMLElement | null;
    if (related !== upButtonRef.current && related !== downButtonRef.current) {
      setShowBtn(false);
    }
  };

  // Текущее значение как число (из поля ввода — строка, из спиннера — number)
  const currentValue = typeof value === "number" ? value : parseFloat(value ?? "");

  const onUpButtonHandler = () => {
    inputRef.current?.focus();
    const v = round(currentValue + stepValue || 1, precision);
    setValue(v);
    onChange?.({ target: { value: v } });
  };
  const onDownButtonHandler = () => {
    inputRef.current?.focus();
    const v = round(currentValue - stepValue || 1, precision);
    setValue(v);
    onChange?.({ target: { value: v } });
  };

  useEffect(() => {
    if (value !== propsValue) {
      setValue(propsValue);
    }
  }, [propsValue, value]);

  useEffect(() => {
    setInputSize({
      width: inputRef.current?.offsetWidth || 0,
      height: inputRef.current?.offsetHeight || 0,
    });
  }, []);

  const offset = -(inputSize?.height || 0) + 5;
  const spinnerWidth = inputSize ? `${inputSize.width}px` : undefined;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.({ target: { value: e.target.value } });
  };

  // legacy `maxWidth` + обычный style → инлайновый стиль
  const inputStyle: CSSProperties = { maxWidth, ...style };

  return (
    <div className={cx(numberInputWrapperClass, className)}>
      {showBtn ? (
        <button
          ref={upButtonRef}
          type="button"
          aria-label="увеличить"
          className={cx(spinnerButtonClass)}
          style={{ top: `${offset}px`, width: spinnerWidth }}
          onClick={onUpButtonHandler}
        >
          ^
        </button>
      ) : null}
      <input
        ref={inputRef}
        name={name}
        className={cx(inputClass)}
        {...inputProps}
        lang="en-US"
        value={value ?? ""}
        onChange={handleChange}
        onFocus={onFocusHandler}
        onBlur={onBlurHandler}
        style={inputStyle}
      />
      {showBtn ? (
        <button
          ref={downButtonRef}
          type="button"
          aria-label="уменьшить"
          className={cx(spinnerButtonClass)}
          style={{ bottom: `${offset}px`, width: spinnerWidth }}
          onClick={onDownButtonHandler}
        >
          v
        </button>
      ) : null}
    </div>
  );
};
