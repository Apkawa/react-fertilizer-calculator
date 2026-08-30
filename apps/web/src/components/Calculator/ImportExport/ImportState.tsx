import { ACCEPT_FORMATS, FORMATS_MAP } from "@fertilizer/calculator/format";
import { IconButton } from "@fertilizer/icons";
import React, { type ChangeEvent, createRef, useEffect, useState } from "react";
import { useStore } from "@/store";

type ImportStateProps = {};

export function ImportState(props: ImportStateProps) {
  const buttonRef = createRef<HTMLSpanElement>();
  const [size, setSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const newSize = {
      width: buttonRef.current?.offsetWidth || 0,
      height: buttonRef.current?.offsetHeight || 0,
    };
    if (size.width !== newSize.width) {
      setSize(newSize);
    }
  }, [buttonRef, size.width]);

  const loadData = (file: File, data: string) => {
    const ext = "." + file.name.split(".").pop();
    if (FORMATS_MAP[ext]) {
      const f = new FORMATS_MAP[ext]();
      const p = f.import(data);
      useStore.getState().importState(p);
    }
  };

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (!file) {
      return file;
    }
    const reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result);
      loadData(file, reader.result as string);
    };
    reader.readAsText(file);
  };
  return (
    <>
      {/* a11y (stage 4): file-инпут был вложен внутрь <button> (nested-interactive).
          Теперь инпут — сосед кнопки и накрывает её: клик по иконке открывает диалог. */}
      <span ref={buttonRef} className="relative inline-block">
        <IconButton name="import" aria-label="Импорт настроек" />
        <input
          type="file"
          accept={ACCEPT_FORMATS}
          aria-label="Импорт настроек"
          onChange={(event) => handleOnChange(event)}
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            opacity: 0,
            ...size,
          }}
          title={"Импорт настроек"}
        />
      </span>
    </>
  );
}
