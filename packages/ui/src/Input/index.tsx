import React, { type InputHTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Представительский инпут (заменяет легасный инпут формы).
// Хук data-ui="input" — стабильная точка таргета схем
// (`html[data-scheme=x] [data-ui=input]`); ставится после spread, чтобы
// не перебивался внешними props (как Button/Label).
export const Input = ({ className, ...props }: InputProps) => (
  <input className={cx(css.input, className)} {...props} data-ui="input" />
);
