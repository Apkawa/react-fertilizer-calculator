import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Кнопка (заменяет легасную кнопку); ref прокидывается до DOM-кнопки
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx(css.button, className)} {...props} />
));
