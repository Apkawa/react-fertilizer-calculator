// tsc: side-effect-импорты .css в компонентах (в тестах vitest их заглушает,
// в приложении Vite собирает CSS в бандл)
declare module "*.css";
