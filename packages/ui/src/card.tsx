import React, { type HTMLAttributes } from "react";
import { cx } from "./cx";
import { cardClass } from "./styles.css";

export type CardProps = HTMLAttributes<HTMLDivElement>;

// Карточка (заменяет легасную карточку)
export const Card = ({ className, ...props }: CardProps) => (
  <div className={cx(cardClass, className)} {...props} />
);
