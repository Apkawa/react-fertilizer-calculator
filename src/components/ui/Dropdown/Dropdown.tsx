import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import {Input} from "@rebass/forms";
import {Button, Flex} from "rebass";
import {DropdownList} from "./DropdownList";
import {DropdownContext, DropdownContextInterface} from "./context";
import {ItemType, RenderItemCallback, RenderValueCallback} from "./types";

export interface DropdownProps<T> {
  value?: ItemType<T>,
  items: T[],
  renderValue?: RenderValueCallback<T>
  renderItem?: RenderItemCallback<T>

  onEdit?: (value: string) => void,
  onChange?: (item: ItemType<T>) => void,
  width?: number
}

export function Dropdown<T>(props: DropdownProps<T>) {
  const {width} = props
  const renderValue: RenderValueCallback<T> = item => {
    if (props.renderValue) {
      return props.renderValue(item)
    }
    return (item || '') + ''
  }

  const [opened, setOpened] = useState(false)
  const [item, setItem] = useState(props.value || null)
  const [value, setValue] = useState(renderValue(props.value || null))
  const containerRef = useRef<HTMLDivElement>()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current
        && !containerRef.current.contains(event.target as any)) {
        setOpened(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [containerRef])

  const onClickItemHandler = (item: ItemType<T>) => {
    setItem(item)
    setValue(renderValue(item))

    props.onChange && props.onChange(item)

    setOpened(false)
  }
  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setValue(val)
    setOpened(false)
  }

  const onKeyDownInput = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation()
    if (event.key === 'Enter') {
      props.onEdit && props.onEdit(value)
    }
    if (event.key === 'Escape') {
      onClickItemHandler(item)
    }
  }

  const context: DropdownContextInterface<T> = {
    onItemClick: onClickItemHandler,
    renderItem: props.renderItem,
  }

  return (
    <DropdownContext.Provider value={context}>
      <Flex flexDirection="column" width={width} ref={containerRef}>
        <Flex>
          <Input
            value={value}
            onChange={onChangeInput}
            onKeyDown={onKeyDownInput}
            onBlur={() => value && props.onEdit && props.onEdit(value)}
          />
          <Button type="button" onClick={() => setOpened(!opened)}> V </Button>
        </Flex>
        <Flex>
          <Flex sx={{position: "absolute"}}
                flexDirection="column"
                width={containerRef.current?.offsetWidth}
          >
            {opened && <DropdownList<T> items={props.items}/>}
          </Flex>
        </Flex>

      </Flex>
    </DropdownContext.Provider>
  )
}
