import * as React from "react";

// React 19: глобальное пространство имён JSX убрано из @types/react (теперь React.JSX).
// Старые пакеты (react-markdown v8 — сырые .ts-типы, ссылающиеся на глобальный JSX)
// без него не типизируются — переобъявляем глобальный JSX как алиас на React.JSX.
declare global {
  namespace JSX {
    type Element = React.JSX.Element;
    type ElementClass = React.JSX.ElementClass;
    interface IntrinsicAttributes extends React.JSX.IntrinsicAttributes {}
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
  }
}
