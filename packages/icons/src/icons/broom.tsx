import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Метла» — полная очистка (сброс рецепта). По диагонали «/»: ручка вверху
 * справа, щётка внизу слева (пожелание заказчика: метла по диагонали). */
export const BroomIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M20 4l-7.5 7.5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
    />
    <path
      d="M9.5 8.5L14.5 13.5L10.5 19.5L4.5 13.5Z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
