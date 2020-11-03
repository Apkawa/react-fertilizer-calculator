import React, {FunctionComponent, useContext} from "react";
import {Box, Flex} from "rebass";
// import styled from '@emotion/styled'
import {DropdownContext} from "./context";
import styled, {css} from "styled-components";

interface DropdownItemProps<T> {
  value: T,
  index: number,
}


const ItemContainer: FunctionComponent = ({
                                            children,
                                          }) => {
  return <Flex
    padding={2}
    sx={{
      position: "relative",
      zIndex: 1,
      '&::before': {
        backgroundColor: 'highlight',
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      },
      '&:hover::before': {
        opacity: 0.1,
        // boxShadow: "inset 0 0 0 99999px rgba(0,0,0,0.1)"
      }
    }}
  >
    {children}
  </Flex>

}

const StyledItemBox = styled(Box)`
  ${props => props.disabled 
    && css`
      pointer-events: none;
      opacity: 0.4;
  `}

`

export function DropdownItem<T>(props: DropdownItemProps<T>) {
  const {value, index} = props;
  const ctx = useContext(DropdownContext);

  const renderItem = () => {
    if (ctx.renderItem) {
      return <ctx.renderItem item={value} index={index} />
    }
    return (value + '')
  }

  const onItemClickHandler = () => {
    if (ctx.onItemClick) {
      ctx.onItemClick(value)
    }
  }

  return (
    <StyledItemBox
      onClick={onItemClickHandler}
      disabled={ctx.checkDisabledItem && ctx.checkDisabledItem(value)}
    >
      <ItemContainer>
        {renderItem()}
      </ItemContainer>
    </StyledItemBox>
  )
}
