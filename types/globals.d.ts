interface Object {
  hasOwnProperty<K extends PropertyKey>(key: K): this is Record<K, unknown>;
}
declare const __COMMIT_HASH__: string
declare const __COMMIT_DATE__: string
declare const __VERSION__: string
declare const __COMMIT_REF_NAME__: string
declare const __PUBLIC_PATH__: string


// Vite-эквивалент старой `??raw-loader` (webpack) — текст файла как default-экспорт.
declare module "*.md?raw" {
  const value: string
  export default value
}
