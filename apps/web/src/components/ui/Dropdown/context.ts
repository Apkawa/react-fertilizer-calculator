import React, { type Context } from "react";
import type { ItemCallback, RenderItemCallback } from "./types";

// TODO  сделать генерик
export interface DropdownContextInterface<T = any> {
  onItemClick?: ItemCallback<T>;
  renderItem?: RenderItemCallback<T>;
  checkDisabledItem?: ItemCallback<T, boolean>;
}

export type DropdownContext<T> = Context<DropdownContextInterface<T>>;
export const DropdownContext: DropdownContext<any> = React.createContext({});
