import { act, renderHook } from "@testing-library/react";
import { useWindowSize } from "./use-window-size";

// Баг (Stage 2 «restyle», red-фаза): в обработчике resize хук вызывает
// setWindowSize(getWindowSize) — в state сохраняется ФУНКЦИЯ вместо значения
// (эффект зовёт handleResize сразу при монтировании, так и баг виден с первого
// рендера). После resize useWindowSize() должен возвращать ЧИСЛЫ, а сейчас
// возвращает функцию — этот тест красный до исправления.
test("useWindowSize: после resize возвращает числа — новый размер окна", () => {
  const { result } = renderHook(() => useWindowSize());

  // jsdom сам не меняет innerWidth/innerHeight — задаём новый размер окна
  // и стриггерим resize внутри act (обновление state из слушателя flushится
  // синхронно только под act).
  act(() => {
    Object.defineProperty(window, "innerWidth", {
      value: 1280,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 800,
      writable: true,
      configurable: true,
    });
    window.dispatchEvent(new Event("resize"));
  });

  const size = result.current;
  expect(typeof size.width).toBe("number");
  expect(typeof size.height).toBe("number");
  expect(size.width).toBe(1280);
  expect(size.height).toBe(800);
});
