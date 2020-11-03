import {ComponentType} from "react";

export type ItemType<T> = T | null
export type ItemCallback<T, R=void> = (item: ItemType<T>) => R
export type RenderValueCallback<T> = ItemCallback<T, string>
type RenderItemCallback<T> = ComponentType<{ item: T, index: number }>

