import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "./cx";
import { buttonClass } from "./styles.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Кнопка (заменяет rebass Button); ref прокидывается до DOM-кнопки
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx(buttonClass, className)} {...props} />
));
