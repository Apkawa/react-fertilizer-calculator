import {Theme} from "@/themes/types";

const presets: any = require('@theme-ui/presets')

export const defaultTheme: Theme = {
  ...presets.polaris,
  colors: {
    ...presets.polaris.colors,
    N: '#05AD11',
    P: '#DBC403',
    K: '#E07206',
    Ca: '#D1C7C7',
    Mg: '#AB0AE0',
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
