// Стили компонента — plain CSS (side-effect-импорт в index.tsx).
// В тестах vitest CSS заглушается, в приложении Vite собирает его в бандл.
declare const styleCss: string;
export default styleCss;
