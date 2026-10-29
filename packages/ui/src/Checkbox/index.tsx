import React, { type InputHTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type CheckboxProps = InputHTMLAttributes<HTMLInputElement>;

// Чекбокс (нативный контрол, канон макета: accent-color --primary).
// Хук data-ui="checkbox" на самом input — стабильная точка таргета схем
// (`html[data-scheme=x] [data-ui=checkbox]`); ставится после spread, чтобы
// не перебивался внешними props (как Button/Label).
export const Checkbox = ({ className, ...props }: CheckboxProps) => (
  <input type="checkbox" className={cx(css.checkbox, className)} {...props} data-ui="checkbox" />
);
