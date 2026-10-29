import { useCallback, useEffect, useState } from "react";
import { SCHEMES, type SchemeId } from "./schemes";

/** Хранимый ключ выбранной схемы оформления. */
const STORAGE_KEY = "ui:color-scheme";

export function useColorScheme(): readonly [SchemeId, (id: SchemeId) => void] {
  const [scheme, setSchemeState] = useState<SchemeId>(getSavedScheme);

  // При каждом выборе схемы (и при монтировании) ставим html[data-scheme].
  useEffect(() => {
    applyScheme(scheme);
  }, [scheme]);

  const setScheme = useCallback((next: SchemeId) => {
    setSchemeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [scheme, setScheme];
}

/** Сохранённая схема: неизвестный id трактуется как дефолт. */
function getSavedScheme(): SchemeId {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return isSchemeId(saved) ? saved : "default";
}

/** Id из реестра SCHEMES (единственный источник списка схем). */
function isSchemeId(value: string | null): value is SchemeId {
  return SCHEMES.some((scheme) => scheme.id === value);
}

/**
 * Ставит data-scheme на <html>; чистая функция — вызывать можно до монтирования.
 * Неизвестный id трактуется как "default".
 */
export function applyScheme(id: string): void {
  document.documentElement.setAttribute("data-scheme", isSchemeId(id) ? id : "default");
}
