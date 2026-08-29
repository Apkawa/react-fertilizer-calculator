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
