# Draft — redux-to-zustand

> Raw input, verbatim. No research or interpretation.

/dumbspec
переписываем redux+saga+redux-forms на zustand + zod (опционально, возможно и не нужен)

порядок думаю такой:

0) добавляем тесты для компонентов которые проверяют что логика сохранилась. 
причем сделать тесты так чтобы можно было легко поменять с redux на zustand
1) сначала пилим zustand стор
2) переносим компоненты на новый стор
3) избавляемся от зависимостей связанные с redux и saga

## Context (user clarifications)

- Git pre-check: untracked `.baseline-smoke/` was deleted by the user; tree is clean.
- Branch: stay on the current `v18-ui` branch (no new branch).
