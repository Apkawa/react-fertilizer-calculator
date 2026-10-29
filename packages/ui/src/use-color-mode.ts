import { useCallback, useEffect, useState } from "react";

/**
 * Намерение цвета: "light", "dark" или "system". Хранимое — намерение;
 * html[data-theme] всегда резолвится в "light" | "dark" (см. applyTheme).
 */
export type ColorMode = "light" | "dark" | "system";

/** Новый ключ localStorage (замена legacy-ключа старой темы). */
const STORAGE_KEY = "ui:color-mode";
const LEGACY_KEY = "theme-ui:mode";

/** Резолв намерения в атрибут: "system" — по prefers-color-scheme, иначе как есть. */
function resolveTheme(mode: ColorMode): "light" | "dark" {
  if (mode === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return mode;
}

/**
 * Применяет резолвнутый режим к <html>: по data-theme theme.css переключает
 * CSS-переменные. Чистая функция — вызывать можно и до монтирования React.
 */
export function applyTheme(mode: ColorMode): void {
  document.documentElement.setAttribute("data-theme", resolveTheme(mode));
}

export function useColorMode(): readonly [ColorMode, (mode: ColorMode) => void] {
  const [mode, setModeState] = useState<ColorMode>(getSavedMode);

  // При каждом изменении намерения (и при монтировании): применяем к <html>
  // и мигрируем legacy-ключ (однократно, пока новый ключ пуст).
  useEffect(() => {
    applyTheme(mode);
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy !== null && window.localStorage.getItem(STORAGE_KEY) === null) {
      window.localStorage.setItem(STORAGE_KEY, normalizeStored(legacy));
    }
  }, [mode]);

  // В "system" синхронизируем атрибут с системой: на change
  // prefers-color-scheme реприменяем резолвнутый режим (намерение не меняется).
  useEffect(() => {
    if (mode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [mode]);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [mode, setMode];
}

/** Сохранённое намерение: новый ключ важнее legacy; если нет ни того ни другого — light. */
function getSavedMode(): ColorMode {
  const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
  return normalizeStored(saved);
}

/** Нормализация чтения: легаси-значение "default" трактуется как "light". */
function normalizeStored(value: string | null): ColorMode {
  if (value === "dark" || value === "system") return value;
  return "light";
}
