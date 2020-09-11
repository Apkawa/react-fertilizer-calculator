export declare type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

declare global { // need this declaration if in a module
  interface Object {
    hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, unknown>;
  }
  declare const __COMMIT_HASH__: string
  declare const __COMMIT_DATE__: string
  declare const __VERSION__: string
} // need this declaration if in a module


declare module "!!raw-loader!*" {
  const value: string
  export default value
}
