import React, {forwardRef, MouseEventHandler, PropsWithChildren, useEffect, useState} from "react";
import {Button, ButtonProps} from "rebass";
import {EmotionIcon} from '@emotion-icons/emotion-icon'

import {useTheme} from "emotion-theming";
import {Theme} from "../../theme";


interface IconButtonProps extends PropsWithChildren<Omit<ButtonProps, keyof React.HTMLProps<HTMLButtonElement>>> {
  component: EmotionIcon,
  onClick?: MouseEventHandler<HTMLButtonElement>,
  size?: number | string
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (props, buttonRef) => {
    const {
      component: IconComponent,
      size = "1.5em",
      children,
      ...extraProps
    } = props
    const [containerSize, setSize] = useState<number | string>(size || 0)
    const theme = useTheme<Theme>()

    useEffect(() => {
      if (!size && buttonRef && 'current' in buttonRef) {
        setSize(buttonRef.current?.offsetWidth || 0)
      }
    }, [buttonRef, setSize, size])

    return (
      <Button type="button" {...extraProps} ref={buttonRef}>
        <IconComponent
          color={theme.colors?.background}
          size={containerSize}
        />
        {children}
      </Button>
    )
  })
