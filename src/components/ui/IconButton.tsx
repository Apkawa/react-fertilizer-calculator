import React, {FunctionComponent, MouseEventHandler, useEffect, useRef, useState} from "react";
import {Button, ButtonProps} from "rebass";
import {EmotionIcon} from '@emotion-icons/emotion-icon'
import {useTheme} from "emotion-theming";
import {Theme} from "../../theme";


interface IconButtonProps extends Omit<ButtonProps, keyof React.HTMLProps<HTMLButtonElement>> {
  component: EmotionIcon,
  onClick: MouseEventHandler<HTMLButtonElement>,
  size?: number|string
}

export const IconButton: FunctionComponent<IconButtonProps> = (props) => {
  const {component: IconComponent, size="1.5em", ...extraProps} = props
  const buttonRef = useRef<HTMLButtonElement>()
  const [containerSize, setSize] = useState<number|string>(size || 0)
  const theme = useTheme<Theme>()

  useEffect(() => {
    if (!size) {
      setSize(buttonRef.current?.offsetWidth || 0)
    }
  }, [setSize, size])

  return (
    <Button type="button" {...extraProps} ref={buttonRef}>
      <IconComponent
        color={theme.colors?.background}
        size={containerSize}
      />
    </Button>
  )
}
