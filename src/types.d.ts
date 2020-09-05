export declare type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

declare global { // need this declaration if in a module
  interface Object {
    hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, unknown>;
  }
} // need this declaration if in a module
