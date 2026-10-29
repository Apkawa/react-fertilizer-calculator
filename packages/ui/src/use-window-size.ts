import { useEffect, useState } from "react";

interface Size {
  width: number;
  height: number;
}

function getWindowSize(): Size {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
}

// Ширина/высота окна (перенесён из apps/web/src/hooks/screen.ts — нужен Sidebar).
export function useWindowSize() {
  const [windowSize, setWindowSize] = useState<Size>(getWindowSize());

  useEffect(() => {
    function handleResize() {
      // Явный вызов getWindowSize(): раньше сюда передавалась сама функция
      // и React звал её как updater — результат был эквивалентен, но
      // читается такой код как «в state сохраняется функция» (guard-тест
      // use-window-size.test.tsx фиксирует, что в state — числа).
      setWindowSize(getWindowSize());
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
