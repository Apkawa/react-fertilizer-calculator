# Draft: pnpm-workspace

> Raw input (verbatim, user language — Russian):

/dumbspec 
Я хочу распилить на pnpm workspace

packages:
  - 'apps/*'
  - 'packages/*'

в apps будет web - это наше реакт приложение (все что было в src)
в packages будет src/calculator и src/test-utils

результат сборки не должен меняться, все по старому.
