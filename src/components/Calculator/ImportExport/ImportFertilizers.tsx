import React, {ChangeEvent, createRef, useEffect, useState} from "react";
import {Import} from "@styled-icons/boxicons-regular/Import"
import {IconButton} from "@/components/ui/IconButton";
import {csvParse} from "@/utils/csv";
import {FERTILIZER_ELEMENT_NAMES} from "@/calculator/constants";
import {buildNPKFertilizer} from "@/calculator/fertilizer";
import {useDispatch} from "react-redux";
import {fertilizerPush} from "@/components/Calculator/actions";

interface ImportFertilizersProps {
}

const COLUMNS = ['id', ...FERTILIZER_ELEMENT_NAMES]

export function ImportFertilizers(props: ImportFertilizersProps) {
  const buttonRef = createRef<HTMLButtonElement>()
  const dispatch = useDispatch()
  const [size, setSize] = useState({width: 0, height: 0})
  useEffect(() => {
    const newSize = {
      width: buttonRef.current?.offsetWidth || 0,
      height: buttonRef.current?.offsetHeight || 0,
    }
    if (size.width !== newSize.width) {
      setSize(newSize)
    }
  }, [buttonRef, size.width])

  const loadCSV = (csv: string) => {
    const p = csvParse(csv, {columns: COLUMNS})
    if (isNaN(parseInt(p[0].N))) {
      p.splice(0, 1)
    }
    for (let {id, ...npk} of p) {
      const f = buildNPKFertilizer(id, npk)
      dispatch(fertilizerPush(f))
    }
  }

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value, e.target.files?.[0])
    const file = e.target.files?.[0]
    if (!file) {
      return file
    }
    let reader = new FileReader();
    reader.onload = () => {
      console.log(reader.result)
      loadCSV(reader.result as string)

    }
    reader.readAsText(file)

  }
  return (
    <>
      <IconButton
        sx={{
          position: "relative"
        }}
        ref={buttonRef}
        component={Import}
      >
        <input type="file"
               accept="text/csv, .csv"
               onChange={event => handleOnChange(event)}
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
  )
}
