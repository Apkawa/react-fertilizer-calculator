import React, { type InputHTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type RadioProps = InputHTMLAttributes<HTMLInputElement>;

// Радио-кнопка (нативный контрол, канон макета: accent-color --primary).
// Хук data-ui="radio" на самом input — стабильная точка таргета схем
// (`html[data-scheme=x] [data-ui=radio]`); ставится после spread, чтобы
// не перебивался внешними props (как Button/Label).
export const Radio = ({ className, ...props }: RadioProps) => (
  <input type="radio" className={cx(css.radio, className)} {...props} data-ui="radio" />
);
