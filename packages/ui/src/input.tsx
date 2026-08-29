import React, { type InputHTMLAttributes } from "react";
import { cx } from "./cx";
import { inputClass } from "./styles.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Представительский инпут (заменяет @rebass/forms Input)
export const Input = ({ className, ...props }: InputProps) => (
  <input className={cx(inputClass, className)} {...props} />
);
