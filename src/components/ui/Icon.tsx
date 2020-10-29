import React, {forwardRef, MouseEventHandler, useEffect, useState} from "react";
import {Box, BoxProps} from "rebass";
import {EmotionIcon} from '@emotion-icons/emotion-icon'

import {useTheme} from "emotion-theming";
import {Theme} from "@/themes/types";


interface IconProps extends Omit<BoxProps, keyof HTMLDivElement | 'css'> {
  component: EmotionIcon,
  disabled?: boolean,
  size?: number | string
}

export const Icon = forwardRef<HTMLDivElement, IconProps>(
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
      <Box {...extraProps} ref={buttonRef}>
        <IconComponent
          color={theme.colors?.text}
          size={containerSize}
        />
      </Box>
    )
  })
