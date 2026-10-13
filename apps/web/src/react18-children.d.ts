import * as React from "react";

// React 18: в @types/react 18 из `IntrinsicAttributes` убрали `children` —
// class-компонентам, чьи типы не описывают `children`, нужно объявить его явно.
// Все перечисленные компоненты реально рендерят children (react-router v5 —
// роуты, react-sortablejs — элементы списка).

declare module "react-router-dom" {
  interface HashRouterProps {
    children?: React.ReactNode;
  }
}

declare module "react-sortablejs" {
  interface ReactSortableProps<T> {
    children?: React.ReactNode;
  }
}
