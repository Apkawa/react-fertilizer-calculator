import { IconButton } from "@fertilizer/icons";
import React, { type ChangeEvent, createRef, useEffect, useState } from "react";

// Кнопка-прокси file-инпорта: структурный DRY (три import-кнопки — рецепты,
// настройки, состояния). Канон hover: невидимый file-инпут инертен для
// курсора (pointer-events: none, tabIndex: -1) — hover/клик попадают на
// <button>, tint из Button работает; клик кнопки проксирует в input.click()
// (диалог файла открывается по жесту пользователя). Инпут остаётся в DOM с
// тем же aria-именом — прежние локейторы тестов не ломаются.
interface FileImportButtonProps {
  /** Доступное имя кнопки и инпута («Импорт рецептов» и т.п.). */
  ariaLabel: string;
  accept: string;
  title?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function FileImportButton(props: FileImportButtonProps) {
  const spanRef = createRef<HTMLSpanElement>();
  const inputRef = createRef<HTMLInputElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const newSize = {
      width: spanRef.current?.offsetWidth || 0,
      height: spanRef.current?.offsetHeight || 0,
    };
    if (size.width !== newSize.width) {
      setSize(newSize);
    }
  }, [spanRef, size.width]);

  return (
    // a11y (stage 4): file-инпут не вкладывается в <button> (nested-interactive)
    // — сосед поверх кнопки, но для курсора инертен (см. комментарий выше).
    <span ref={spanRef} className="relative inline-block">
      <IconButton
        name="import"
        aria-label={props.ariaLabel}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        accept={props.accept}
        aria-label={props.ariaLabel}
        tabIndex={-1}
        onChange={props.onChange}
        style={{
          top: 0,
          left: 0,
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          ...size,
        }}
        title={props.title}
      />
    </span>
  );
}
