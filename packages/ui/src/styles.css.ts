import { globalLayer, style } from "@vanilla-extract/css";

// Слой `components`: стили атомов UI лежат ниже слоя tailwindcss utilities,
// чтобы utility-классы могли переопределять стили атомов.
globalLayer("components");

// Текстовый/числовой инпут (эквивалент @rebass/forms Input в теме polaris:
// border цветом текста, без радиуса, прозрачный фон; нативные спиннеры number
// скрыты — у приложения свои кнопки спиннера)
export const inputClass = style({
  "@layer": {
    components: {
      display: "block",
      width: "100%",
      padding: 8,
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      color: "var(--color-text)",
      backgroundColor: "transparent",
      border: "1px solid var(--color-text)",
      borderRadius: 0,
      "::-webkit-inner-spin-button": {
        appearance: "none",
        margin: 0,
        width: 0,
        height: 0,
      },
      "::-webkit-outer-spin-button": {
        appearance: "none",
        margin: 0,
        width: 0,
        height: 0,
      },
    },
  },
});

// Подпись поля формы (чекбокс/радио + текст рядом)
export const labelClass = style({
  "@layer": {
    components: {
      display: "flex",
      alignItems: "center",
    },
  },
});

// Кнопка (эквивалент rebass Button: primary фон, текст цветом фона, radius 4px)
export const buttonClass = style({
  "@layer": {
    components: {
      appearance: "none",
      display: "inline-block",
      padding: "8px 16px",
      fontFamily: "inherit",
      fontSize: "inherit",
      lineHeight: "inherit",
      color: "var(--color-background)",
      backgroundColor: "var(--color-primary)",
      border: 0,
      borderRadius: 4,
      textAlign: "center",
      textDecoration: "none",
      cursor: "pointer",
    },
  },
});

// Карточка (эквивалент rebass Card в теме приложения: фон, тень small, p: 2)
export const cardClass = style({
  "@layer": {
    components: {
      backgroundColor: "var(--color-background)",
      boxShadow: "var(--shadow-small)",
      padding: 8,
    },
  },
});

// Заголовок (эквивалент rebass Heading: h2 по умолчанию, без margin)
export const headingClass = style({
  "@layer": {
    components: {
      margin: 0,
      fontFamily: "var(--font-heading)",
      fontSize: "0.875rem",
      fontWeight: "var(--font-weight-heading)",
      lineHeight: "var(--line-height-heading)",
      color: "var(--color-text)",
    },
  },
});

// Обёртка числового инпута: кнопки спиннера позиционируются абсолютно
export const numberInputWrapperClass = style({
  "@layer": {
    components: {
      position: "relative",
      display: "block",
    },
  },
});

// Кнопка спиннера числового инпута (прозрачная накладка 3em сверху/снизу)
export const spinnerButtonClass = style({
  "@layer": {
    components: {
      position: "absolute",
      height: "3em",
      zIndex: 30,
      background: "transparent",
      border: 0,
      padding: 0,
      cursor: "pointer",
      color: "var(--color-text)",
    },
  },
});

// ────────────── Составные компоненты (Stage 3) ──────────────

// Шеврон дропдауна (заменяет styled(Icon) `IconDown`: цвет текста, h 3rem, opacity)
export const dropdownChevronClass = style({
  "@layer": {
    components: {
      color: "var(--color-text)",
      height: "3rem",
      opacity: "0.5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ":hover": { opacity: "0.7" },
    },
  },
});

// Пункт дропдауна (заменяет ItemContainer: Flex + sx с ::before-подсветкой hover)
export const dropdownItemClass = style({
  "@layer": {
    components: {
      position: "relative",
      zIndex: 1,
      padding: 8,
      display: "flex",
      // Сброс нативных стилей <button> (элемент пункта — настоящая кнопка)
      border: 0,
      background: "transparent",
      appearance: "none",
      textAlign: "left",
      font: "inherit",
      cursor: "pointer",
      "::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        opacity: "0",
        backgroundColor: "var(--color-highlight)",
      },
      selectors: {
        "&:hover::before": { opacity: "0.1" },
      },
    },
  },
});

// Отключённый пункт дропдауна (заменяет styled(Box) c disabled-вариантом)
export const dropdownItemDisabledClass = style({
  "@layer": {
    components: {
      pointerEvents: "none",
      opacity: "0.4",
    },
  },
});

// Список дропдауна (заменяет rebass Card в DropdownList; max-height — инлайном)
export const dropdownListClass = style({
  "@layer": {
    components: {
      backgroundColor: "var(--color-background)",
      boxShadow: "var(--shadow-small)",
      padding: 0,
      overflowY: "auto",
      zIndex: 3,
    },
  },
});

// Оверлей модалки (заменяет styled(Flex) StyledOverlay; top — инлайном)
export const modalOverlayClass = style({
  "@layer": {
    components: {
      overflowY: "auto",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      zIndex: 999,
      "@media": {
        "screen and (max-height: 500px), screen and (max-width: 500px)": {
          alignItems: "initial",
        },
      },
    },
  },
});

// Карточка модалки (заменяет rebass Card внутри оверлея)
export const modalCardClass = style({
  "@layer": {
    components: {
      backgroundColor: "#fff",
      boxShadow: "var(--shadow-small)",
      padding: 8,
      height: "max-content",
    },
  },
});

// Оверлей сайдбара, докнутый (закреплён слева, узкий)
export const sidebarOverlayClass = style({
  "@layer": {
    components: {
      overflowY: "auto",
      position: "absolute",
      height: "100%",
      top: 0,
      left: 0,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "stretch",
      zIndex: 999,
      width: "fit-content",
      // Сброс нативных стилей <button> (оверлей — кнопка «закрыть по клику»)
      border: 0,
      background: "transparent",
      appearance: "none",
      textAlign: "left",
      font: "inherit",
    },
  },
});

// Оверлей сайдбара, не докнут (на весь экран, с полупрозрачным фоном)
export const sidebarOverlayUndockedClass = style({
  "@layer": {
    components: {
      width: "100%",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
  },
});

// Карточка сайдбара (заменяет rebass Card внутри оверлея)
export const sidebarCardClass = style({
  "@layer": {
    components: {
      backgroundColor: "#fff",
      boxShadow: "var(--shadow-small)",
      padding: 8,
      height: "100vh",
      width: "300px",
      marginRight: 8,
    },
  },
});

// Ленточка "Fork me on GitHub" (заменяет styled-components)
// Ленточка-обёртка (span): на широких экранах — абсолютный блок 200×200 в углу
export const forkMeClass = style({
  "@layer": {
    components: {
      "@media": {
        "screen and (min-width: 800px)": {
          position: "absolute",
          display: "block",
          top: 0,
          right: 0,
          width: 200,
          overflow: "hidden",
          height: 200,
          zIndex: 100,
        },
      },
    },
  },
});

// Ссылка-ленточка (a): чёрная плашка с белыми «складками», на hover — красная
export const forkMeLinkClass = style({
  "@layer": {
    components: {
      background: "#000",
      color: "#fff",
      textDecoration: "none",
      fontFamily: "arial, sans-serif",
      textAlign: "center",
      fontWeight: "bold",
      padding: "5px 40px",
      fontSize: "1rem",
      lineHeight: "2rem",
      position: "relative",
      transition: "0.5s",
      ":hover": {
        background: "#c11",
        color: "#fff",
      },
      "::before": {
        content: '""',
        width: "100%",
        display: "block",
        position: "absolute",
        top: 1,
        left: 0,
        height: 1,
        background: "#fff",
      },
      "::after": {
        content: '""',
        width: "100%",
        display: "block",
        position: "absolute",
        left: 0,
        bottom: 1,
        top: "auto",
        height: 1,
        background: "#fff",
      },
      "@media": {
        "screen and (min-width: 800px)": {
          position: "absolute",
          top: 40,
          right: -50,
          transform: "rotate(45deg)",
          boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.8)",
        },
      },
    },
  },
});
