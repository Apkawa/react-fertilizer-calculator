import React, { type HTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type LabelProps = HTMLAttributes<HTMLLabelElement>;

// Подпись поля формы; контрол передаётся внутрь (children) — паттерн «label оборачивает
// input». Хук data-ui="label" — стабильная точка таргета схем
// (`html[data-scheme=x] [data-ui=label]`); ставится после spread, чтобы не
// перебивался внешними props. Поведение легасное сохранено: for/htmlFor
// прокидывается через props, flex-ряд «контрол + текст» (Checkbox/Radio).
export const Label = ({ className, ...props }: LabelProps) => {
  // biome-ignore lint/a11y/noLabelWithoutControl: контрол передаётся как children (см. Form/Checkbox)
  return <label className={cx(css.label, className)} {...props} data-ui="label" />;
};
