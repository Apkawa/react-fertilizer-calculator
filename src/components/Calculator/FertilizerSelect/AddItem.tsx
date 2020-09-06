import React, {FunctionComponent} from "react";
import {Box, Button, Card, Flex} from "rebass";
import {Select} from '@rebass/forms'

interface AddItemProps {
}

export const AddItem: FunctionComponent<AddItemProps> = () => {
  return (
    <Card>
      <Flex sx={{justifyContent: 'space-around'}}>
        <Box flex={1} pr={2}>

        <Select>
              <option>Velgro</option>
        </Select>
        </Box>
        <Button>Add</Button>
      </Flex>

    </Card>
  )
}
