import React from "react";
import { type IconSvgProps, svgProps } from "../base";

/** «Крест» — закрыть / снять элемент. */
export const CloseIcon = (props: IconSvgProps) => (
  <svg aria-hidden="true" focusable="false" {...svgProps(props.size, props.color, props.style)}>
    <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" />
  </svg>
);
