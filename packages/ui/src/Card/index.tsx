import React, { type HTMLAttributes } from "react";
import { cx } from "../cx";
import css from "./style.module.css";

export type CardProps = HTMLAttributes<HTMLDivElement>;

// Карточка (заменяет легасную карточку). Хук data-ui="card" — стабильная
// точка таргета схем (`html[data-scheme=x] [data-ui=card]`); ставится после
// spread, чтобы не перебивался внешними props. Заголовок карточки — Heading
// (h2 по умолчанию, 1.125rem/600 — см. Text/style.module.css), отдельного
// header/title-класса у Card нет.
export const Card = ({ className, ...props }: CardProps) => (
  <div className={cx(css.card, className)} {...props} data-ui="card" />
);
