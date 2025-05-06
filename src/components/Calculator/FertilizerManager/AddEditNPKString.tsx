import React, {ChangeEvent, FunctionComponent, useEffect, useState} from "react";
import {Flex} from "rebass";
import {NPKElements} from "@/calculator/types";
import {Input} from "@rebass/forms";
import {useFormName, useFormValues} from "@/hooks/ReduxForm";
import {AddEditFormType} from "@/components/Calculator/FertilizerManager/types";
import {parseProfileStringToNPK, stringifyProfile} from "@/calculator/profile";

interface AddEditNPKStringProps {
  npk?: NPKElements,
  onChange?: (elements: NPKElements) => void
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
    const elements = parseProfileStringToNPK(e.target.value)
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
