import { useCallback, useEffect, useState } from "react";

/** Режим темы: светлая ("default") или тёмная ("dark") — замена легасного useColorMode. */
export type ColorMode = "default" | "dark";

/** Новый ключ localStorage (замена legacy-ключа старой темы). */
const STORAGE_KEY = "ui:color-mode";
const LEGACY_KEY = "theme-ui:mode";

export function useColorMode(): readonly [ColorMode, (mode: ColorMode) => void] {
  const [mode, setModeState] = useState<ColorMode>(getSavedMode);

  // При каждом изменении режима (и при монтировании): применяем к <html>
  // и мигрируем legacy-ключ (однократно, пока его не записали сами).
  useEffect(() => {
    applyMode(mode);
    const legacy = window.localStorage.getItem(LEGACY_KEY);
    if (legacy !== null && window.localStorage.getItem(STORAGE_KEY) === null) {
      window.localStorage.setItem(STORAGE_KEY, legacy);
    }
  }, [mode]);

  const setMode = useCallback((next: ColorMode) => {
    setModeState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  return [mode, setMode];
}

function isColorMode(value: string | null): value is ColorMode {
  return value === "default" || value === "dark";
}

/** Сохранённый режим: новый ключ, иначе legacy-ключ; если нет ни того ни другого — светлая. */
function getSavedMode(): ColorMode {
  const saved = window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_KEY);
  return isColorMode(saved) ? saved : "default";
}

/** Применяет режим к <html>: data-theme — по нему theme.css переключает CSS-переменные. */
function applyMode(mode: ColorMode): void {
  document.documentElement.setAttribute("data-theme", mode);
}
