import React from "react";
import {Box, Card, Flex} from "rebass";
import {DropdownItem} from "./DropdownItem";

interface DropdownListProps<T> {
  items: T[],
}

export function DropdownList<T>(props: DropdownListProps<T>) {
  const items = props.items

  return (
    <Card
      backgroundColor={"background"}
      padding={0}
      overflowY={'auto'}
    >
      <Flex flexDirection="column">
        {Array.from(items).map((s, i) => {
          return (
            <Box>
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
