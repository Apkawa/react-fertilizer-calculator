import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Кнопка (заменяет легасную кнопку); ref прокидывается до DOM-кнопки.
// Хук data-ui="button" — стабильная точка таргета схем
// (`html[data-scheme=x] [data-ui=button]`); ставится после spread, чтобы
// не перебивался внешними props.
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx(css.button, className)} {...props} data-ui="button" />
));
