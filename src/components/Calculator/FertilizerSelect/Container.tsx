import React, {FunctionComponent} from "react";
import {Box, Flex} from "rebass";
import {AddItem} from "./AddItem";
import {SelectedList} from "./SelectedList";

interface ContainerProps {
}

export const Container: FunctionComponent<ContainerProps> = () => {
  return (
    <Flex sx={{flexDirection: 'column'}} width='auto'>
        <AddItem/>
        <SelectedList/>
    </Flex>
  )
}
