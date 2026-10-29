// Глобальные настройки предпросмотра Storybook:
// тема @fertilizer/ui — CSS-переменные (side-effect импорт, как в приложении)
import type { Preview } from "@storybook/react";
import { SCHEMES } from "../src/schemes";
import "./style.css";

const preview: Preview = {
  parameters: {},
  // Globals в toolbar: переключатели темы (light/dark) и схем из SCHEMES.
  globals: {
    theme: "light",
    scheme: "default",
  },
  globalTypes: {
    theme: {
      description: "Тема: светлая/тёмная — html[data-theme]",
      icon: "moon",
      defaultValue: "light",
      items: [
        { value: "light", title: "Light" },
        { value: "dark", title: "Dark" },
      ],
    },
    scheme: {
      description: "Схема оформления — html[data-scheme]",
      defaultValue: "default",
      items: SCHEMES.map(({ id, label }) => ({ value: id, title: label })),
    },
  },
  // Простой decorator (KISS): читает globals и ставит data-* на <html>.
  // Cleanup не обязателен — Storybook перезаписывает атрибуты на каждый рендер.
  decorators: [
    (story, context) => {
      document.documentElement.dataset.theme = String(context.globals.theme ?? "light");
      document.documentElement.dataset.scheme = String(context.globals.scheme ?? "default");
      return story();
    },
  ],
};

export default preview;
