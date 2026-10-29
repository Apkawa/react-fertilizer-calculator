import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Глаз закрыт» — показаны только отмеченные удобрения (diagonal slash). */
export const EyeOffIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path
      d="M2.5 12C5 7.8 8.2 5.7 12 5.7s7 2.1 9.5 6.3c-2.5 4.2-5.7 6.3-9.5 6.3S5 16.2 2.5 12z"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth={2} />
    <path d="M4 4l16 16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
  </svg>
);
