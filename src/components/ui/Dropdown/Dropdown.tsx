import React, {ChangeEvent, KeyboardEvent, useEffect, useRef, useState} from "react";
import {Input} from "@rebass/forms";
import {Box, Flex} from "rebass";
import styled from '@emotion/styled'
import {ChevronDownSquare} from '@emotion-icons/boxicons-solid/ChevronDownSquare'
import {DropdownList} from "./DropdownList";
import {DropdownContext, DropdownContextInterface} from "./context";
import {ItemType, RenderItemCallback, RenderValueCallback} from "./types";

const IconDown = styled(ChevronDownSquare)`
  color: ${(props: any) => props.theme.colors.text};
  height: 3rem;
  opacity: 0.5;
  
  &:hover {
    opacity: 0.7;
  }
`

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
  const [editing, setEditing] = useState(false)
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
    setEditing(false)
    setOpened(false)
  }
  const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value
    setValue(val)
    setEditing(true)
    setOpened(false)
  }

  const onKeyDownInputHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation()
    if (event.key === 'Enter') {
      props.onEdit && props.onEdit(value)
    }
    if (event.key === 'Escape') {
      onClickItemHandler(item)
    }
  }

  const onBlurInputHandler = () => {
    if (editing) {
      value && props.onEdit && props.onEdit(value)
    }
  }

  const context: DropdownContextInterface<T> = {
    onItemClick: onClickItemHandler,
    renderItem: props.renderItem,
  }

  return (
    <DropdownContext.Provider value={context}>
      <Flex flexDirection="column" width={width} ref={containerRef}>
        <Flex sx={{position: 'relative'}}>
          <Input
            value={value}
            onChange={onChangeInputHandler}
            onKeyDown={onKeyDownInputHandler}
            onBlur={onBlurInputHandler}
          />
          <Box
            sx={{
              position: "absolute",
              right: 0
            }}
          >
            <IconDown
              onClick={() => setOpened(!opened)}
            />
          </Box>
        </Flex>
        <Flex  sx={{position: 'relative'}}>
          <Flex sx={{position: "absolute"}}
                flexDirection="column"
                width="100%"
          >
            {opened && <DropdownList<T> items={props.items}/>}
          </Flex>
        </Flex>

      </Flex>
    </DropdownContext.Provider>
  )
}
