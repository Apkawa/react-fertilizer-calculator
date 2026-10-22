// tsc: импорты CSS в компонентах (в тестах vitest их заглушает,
// в приложении Vite собирает CSS в бандл).
// *.module.css — мапа имён классов в строки; обычные *.css — строка.
declare module "*.css" {
  const css: string & Record<string, string>;
  export default css;
}
