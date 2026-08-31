Небольшой рефакторинг packages/ui

1) каждый компонент должен быть в своей папке вместе с тестами и стилями
например:

- Button
  - style.css
  - index.tsx
  - test.tsx - юнит тесты компонентов
  - browser.test.ts - для регрессионных тестов посредством vitest/browser

2) Улучшить тесты, добавить регрессионные тесты используя vitest + vitest/browser + @vitest/browser-playwright + vitest-browser-react

Документация тут:
`.dumbspec/current/refactoring-ui-package/docs/vite-browser`

Ну типа так, думаю
```ts
import { render } from 'vitest-browser-react'
import { expect, test } from 'vitest'

test('counter button increments the count', async () => {
  const screen = await render(<Component count={1} />)

  await screen.getByRole('button', { name: 'Increment' }).click()

  await expect.element(screen.getByText('Count is 2')).toBeVisible()
})
```

3) Добавить storybook для всех компонентов в packages/ui

`.dumbspec/current/refactoring-ui-package/docs/storybook-react-vite.md`
+ еще документации, если непонятно:
`.tmp/storybook/docs`
