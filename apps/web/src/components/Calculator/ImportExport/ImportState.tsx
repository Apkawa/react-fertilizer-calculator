import { ACCEPT_FORMATS, FORMATS_MAP } from "@fertilizer/calculator/format";
import React, { type ChangeEvent } from "react";
import { useStore } from "@/store";
import { FileImportButton } from "./FileImportButton";

type ImportStateProps = {};

export function ImportState(props: ImportStateProps) {
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
    <FileImportButton
      ariaLabel="Импорт настроек"
      accept={ACCEPT_FORMATS}
      title="Импорт настроек"
      onChange={(event) => handleOnChange(event)}
    />
  );
}
