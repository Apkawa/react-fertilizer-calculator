import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {Elements, NPKElements} from "@/calculator/types";
import {Input} from "@rebass/forms";
import {FERTILIZER_ELEMENT_NAMES, NPKOxides} from "@/calculator/constants";
import {HPGFormat} from "@/components/Calculator/ImportExport/format/hpg";
import {compositionToElements, elementsToNPK} from "@/calculator/fertilizer";
import {entries} from "@/utils";
import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";

interface AddEditNPKStringProps {
  npk?: NPKElements,
  onChange?: (elements: NPKElements) => void
}

function parseProfileString(profile: string): NPKElements {
  const elements: Partial<Elements> = {}
  const p = HPGFormat.parseProfileStringToObject(profile)
  for (const [k, v] of Object.entries(p)) {
    if (!Number.isFinite(v)) {
      continue
    }

    if (FERTILIZER_ELEMENT_NAMES.includes(k as FERTILIZER_ELEMENT_NAMES)) {
      elements[k as FERTILIZER_ELEMENT_NAMES] = v
    } else {
        // Может быть это какой то оксид. Может даже целое уравнение.
        const npkEl = compositionToElements(
          // Представим это как химическую формулу
          [{percent: v, formula: k}])
        for (const [_e, _p] of entries(npkEl)) {
          if (_p) {
            elements[_e] = (elements[_e] || 0) + _p
          }
        }
    }
  }
  // Конвертируем в оксидную форму
  return elementsToNPK(elements)
}

function stringifyProfile(npk: NPKElements): string {
  let s = FERTILIZER_ELEMENT_NAMES.map(
    e => {
      if (npk[e]) {
        let n = e as string;
        // Т.к. оперируем оксидами, то оксиды выводим как оксиды
        if (NPKOxides.hasOwnProperty(e)) {
          n = NPKOxides[e] as string
        }
        return `${n}=${npk[e]}`
      }
      return undefined
    })
    .filter(e => e).join(' ')
  return `${s}`
}


export const AddEditNPKString: FunctionComponent<AddEditNPKStringProps> = (props) => {
  const {composition_enable} = useFormValues<AddEditFormType>(useFormName())[0]
  const {
    npk,
    onChange,
  } = props
  // TODO разобрать useReducer вместо useState
  const [value, setValue] = useState<string|undefined>(
    npk && stringifyProfile(npk))
  const [isEditing, setEditing] = useState(false)

  useEffect(() => {
    if (!isEditing) {
      setValue(props.npk && stringifyProfile(props.npk))
    }
  }, [isEditing, props.npk]);

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    const elements = parseProfileString(e.target.value)
    console.log(elements)
    onChange && onChange(elements)
  }
  return (
    <Flex flexDirection="column" justifyContent="center" alignItems="center" width={"100%"} padding={2}>
      <label style={{textAlign: 'center'}}>

      </label>
      <Input
        disabled={composition_enable}
        placeholder={'Быстрое редактирование в формате "NO3=10 P2O5=12 K=5"'}
        value={value}
        type="string"
        autoComplete="off"
        style={{
          textAlign: "center"
        }}
        onChange={onChangeInput}
        onFocus={() => setEditing(true)}
        onBlur={() => {
          setEditing(false)
          setValue(props.npk && stringifyProfile(props.npk))}
        }
      />
    </Flex>
  )
}
