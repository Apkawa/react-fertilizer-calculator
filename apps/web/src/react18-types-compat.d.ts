// Совместимость @types/react 18 (период миграции v18-ui, удалить в Stage 8).
//
// 1) @types/react 18 убрал implicit `children` из props кастомных компонентов
//    (в @types/react 16 `JSX.IntrinsicAttributes` включал `ReactNodeChildren`).
//    Лего-@types пакеты (rebass/theme-ui, react-helmet, react-redux,
//    react-router-dom, redux-form) написаны под React 16 и полагаются на
//    implicit children — отсюда массовые "Property 'children' does not exist".
//    Восстанавливаем через merge в глобальный JSX.IntrinsicAttributes.
//
// 2) @types/react 18 удалён легаси `React.SFC`. `StyledComponent` из
//    @emotion/styled-base (emotion 10) наследует `extends React.SFC<...>`;
//    с skipLibCheck сломанное extends молча проглатывается, и styled-
//    компонент остаётся без call-сигнатуры (TS2604). Возвращаем алиас
//    augmentation'ом модуля "react".
// Я пока закомментировал, потом при миграции восстановим
// import type * as React from "react";

// declare global {
//   namespace JSX {
//     interface IntrinsicAttributes {
//       children?: React.ReactNode;
//     }
//   }
// }

// declare module "react" {
//   type SFC<P = {}> = FC<P>;
// }
