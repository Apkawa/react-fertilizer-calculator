import {defineConfig, mergeConfig} from 'vitest/config'
import baseConfig from './vite.config'

// Базовый конфиг (vite.config.ts) уже содержит: alias `@/`, JSX classic,
// `define` с константами сборки — всё это действует и в тестах.
export default mergeConfig(
  baseConfig,
  defineConfig({
    test: {
      // example.ts использует глобальные test/expect (как было в jest)
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
    },
  }),
)
