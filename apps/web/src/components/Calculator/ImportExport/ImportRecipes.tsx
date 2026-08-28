import { FERTILIZER_ELEMENT_NAMES } from "@fertilizer/calculator/constants";
import { IconButton } from "@fertilizer/icons";
import React, { type ChangeEvent, createRef, useEffect, useState } from "react";
import { useStore } from "@/store";
import { csvParse } from "@/utils/csv";

type ImportRecipesProps = {};

const COLUMNS = ["id", ...FERTILIZER_ELEMENT_NAMES];

export function ImportRecipes(props: ImportRecipesProps) {
  const buttonRef = createRef<HTMLButtonElement>();
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

  const loadCSV = (csv: string) => {
    const p = csvParse(csv, { columns: COLUMNS });
    if (isNaN(parseInt(p[0].P))) {
      p.splice(0, 1);
    }
    for (const { id, ...npk } of p) {
      useStore.getState().pushRecipe({ name: id, elements: npk });
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
      loadCSV(reader.result as string);
    };
    reader.readAsText(file);
  };
  return (
    <>
      <IconButton
        sx={{
          position: "relative",
        }}
        ref={buttonRef}
        name="import"
      >
        <input
          type="file"
          accept="text/csv, .csv"
          onChange={(event) => handleOnChange(event)}
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            opacity: 0,
            ...size,
          }}
        />
      </IconButton>
    </>
  );
}
