import React, {Context} from "react";
import {RenderItemCallback} from "./types";

// TODO  сделать генерик
export interface DropdownContextInterface<T=any> {
  onItemClick?: (item: T) => void,
  renderItem?: RenderItemCallback<T>
}

export type DropdownContext<T> = Context<DropdownContextInterface<T>>
export const DropdownContext: DropdownContext<any> = React.createContext({})


