import React, {useEffect, useRef, useState} from "react";
import {Box, Card, Flex} from "rebass";
import {DropdownItem} from "./DropdownItem";

interface DropdownListProps<T> {
  items: T[],
}

export function DropdownList<T>(props: DropdownListProps<T>) {
  const items = props.items

  const itemRef = useRef<HTMLDivElement>()
  const [height, setHeight] = useState(0)

  useEffect(() => {
    setHeight(itemRef?.current?.offsetHeight || 0)
  }, [itemRef])

  return (
    <Card
      backgroundColor={"background"}
      padding={0}
      maxHeight={height * 5}
      overflowY={'auto'}
      sx={{zIndex: 3}}
    >
      <Flex flexDirection="column">
        {Array.from(items).map((s, i) => {
          return (
            <Box ref={i === 0 ? itemRef: null}>
              <DropdownItem<T>
                value={s}
                index={i}
                key={i}
              />
              {i < items.length - 1 ? <hr style={{margin: 0}}/> : null}
            </Box>
          )
        })}
      </Flex>
    </Card>
  )
}
