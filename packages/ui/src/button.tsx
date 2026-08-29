import React, { type ButtonHTMLAttributes } from "react";
import { cx } from "./cx";
import { buttonClass } from "./styles.css";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

// Кнопка (заменяет rebass Button)
export const Button = ({ className, ...props }: ButtonProps) => (
  <button className={cx(buttonClass, className)} {...props} />
);
