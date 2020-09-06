import React, {FunctionComponent} from "react";
import {Flex} from "rebass";
import {SelectedListItem} from "./SelectedListItem";

interface SelectedListProps {
}

export const SelectedList: FunctionComponent<SelectedListProps> = () => {
  return (
    <Flex sx={{
      flexDirection: 'column',
      '& > *': {
        marginTop: '8px !important',
      }
    }}>
      <SelectedListItem/>
      <SelectedListItem/>
      <SelectedListItem/>
      <SelectedListItem/>
      <SelectedListItem/>
    </Flex>
  )
}
