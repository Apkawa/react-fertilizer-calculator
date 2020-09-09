import {ComponentType} from "react";

export type ItemType<T> = T | null
export type RenderValueCallback<T> = (item: ItemType<T>) => string
type RenderItemCallback<T> = ComponentType<{ item: T, index: number }>

