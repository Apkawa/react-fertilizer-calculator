import React, { type ButtonHTMLAttributes, forwardRef } from "react";
import { cx } from "../cx";
import "./style.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Кнопка (заменяет легасную кнопку); ref прокидывается до DOM-кнопки
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => (
  <button ref={ref} className={cx("ui-button", className)} {...props} />
));
