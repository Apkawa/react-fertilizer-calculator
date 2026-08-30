Небольшой рефакторинг packages/ui

1) каждый компонент должен быть в своей папке вместе с тестами и стилями
например:

- Button
  - style.css
  - index.tsx
  - test.tsx
  - test_e2e.ts

2) Улучшить тесты, добавить регрессионные тесты используя vitest + vitest/browser + @vitest/browser-playwright

https://vitest.dev/guide/browser/
https://main.vitest.dev/guide/browser/visual-regression-testing.html#test-specific-elements

3) Проработать момент отладки  компонентов в изолированной среде
