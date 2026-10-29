/**
 * Идентификатор схемы оформления: css-файлы пакета переопределяют токены
 * темы по html[data-scheme] (см. theme.css и scheme-*.css).
 */
export type SchemeId = "default" | "win95" | "retro" | "nature" | "science";

/** Схема: id для html[data-scheme] и русская подпись для переключателя в UI. */
export interface Scheme {
  id: SchemeId;
  label: string;
}

/** Реестр схем: «По умолчанию» первой — это дефолтный html[data-scheme]. */
export const SCHEMES: Scheme[] = [
  { id: "default", label: "По умолчанию" },
  { id: "win95", label: "Windows 95" },
  { id: "retro", label: "Ретро" },
  { id: "nature", label: "Природа" },
  { id: "science", label: "Наука" },
];
