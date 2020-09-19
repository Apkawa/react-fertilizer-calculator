import {SxStyleProp} from "rebass";

export function mobileStyles(styles: SxStyleProp) {
  return {
    '@media screen and (max-width: 800px)': styles
  }
}
