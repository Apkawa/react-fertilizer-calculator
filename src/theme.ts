import {Theme as OldTheme} from 'theme-ui'

const presets: any = require('@theme-ui/presets')

export type Theme = OldTheme

export const defaultTheme = {
  ...presets.polaris,
  colors: {
    ...presets.polaris.colors,
    modes: {
      dark: {
        ...presets.polaris.colors.modes.dark,
        text: "#9d9d9d"
      }
    },
  },
  card: {
    boxShadow: 'small',
    p: 2,
  },
  styles: {
    ...presets.polaris.styles,
    button: {
      color: 'background'
    }
  },
  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)'
  },
}
console.log(defaultTheme)
