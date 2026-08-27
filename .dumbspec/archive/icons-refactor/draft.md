# Draft: icons-refactor

## Raw input (verbatim)

/dumbspec меня раздражает текущая зависимость от иконок. Надо это отрефакторить

1) создать реакт пакет с иконками в packages/icons
2) перенести иконочные компоненты (может еще какие то есть компоненты которые я забыл учесть)
apps/web/src/components/ui/Icon.tsx
apps/web/src/components/ui/IconButton.test.tsx
apps/web/src/components/ui/IconButton.tsx
2) вместо аттрибута component={Trash} или что то еще, использовать name="trash" 
3) генерируем свою библиотеку svg иконок (только те которые испольуются, таким образом избавляемся от зависимостей) и выбираем их в name=. Иконки придумай сам по смыслу, не будем их копировать.
4) выкидываем все зависимости от иконок такие как @emotion* и @styled-icons*
