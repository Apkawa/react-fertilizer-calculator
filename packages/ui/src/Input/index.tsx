import React, { type InputHTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

// Представительский инпут (заменяет легасный инпут формы)
export const Input = ({ className, ...props }: InputProps) => (
  <input className={cx(css.input, className)} {...props} />
);
