# Draft: Система стилей

Вместо
```tsx
import "./style.css";
...
<div className="ui-modal-overlay"/>
```

мы должны использовать style modules

```tsx
import css from "./style.module.css";
...
<div className={css.modalOverlay}/>
```

проверить код и минимизировать глобальные css классы (за исключением tailwind css)

компоненты в ui сделать более изолированными как раз используя scoped css module
