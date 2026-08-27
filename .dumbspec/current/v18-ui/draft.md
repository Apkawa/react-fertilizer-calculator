# Черновик — v18-ui

/dumbspec 
- Актуализация реакта до 18.2 (LTS) (и связаных с ним компонентов)
- поэтапно переписывать компоненты из apps/web/src/components/ui в packages/ui/ с использованием vanilla-extract+tailwindcss
- кроме reduxform, мы потом выкинем redux+saga+forms, но это будет в другой  задачи
- Отказываемся от styled-components, rebass, theme-ui, styled-icons в пользу vanilla-extract+tailwindcss (Типизация стилей + css собирается во время сборки) в остальных частях проекта
