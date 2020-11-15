import React, {ChangeEvent, createRef, useEffect, useState} from "react";
import {Import} from "@styled-icons/boxicons-regular/Import"
import {IconButton} from "@/components/ui/IconButton";
import {useDispatch} from "react-redux";
import {loadStateStart} from "@/components/Calculator/actions";
import {ExportStateJSON} from "@/components/Calculator/ImportExport/ExportState";

interface ImportStateProps {
}


export function ImportState(props: ImportStateProps) {
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

  const loadData = (json: string) => {
    // TODO validate
    const p = JSON.parse(json) as ExportStateJSON

    dispatch(loadStateStart(p))

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
      loadData(reader.result as string)

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
               accept="text/json, .json"
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
