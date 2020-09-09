const presets: any = require('@theme-ui/presets')

export const defaultTheme = {
  ...presets.polaris,
  card: {
    boxShadow: 'small',
    p: 2,
  },

  shadows: {
    small: '0 0 4px rgba(0, 0, 0, .125)',
    large: '0 0 24px rgba(0, 0, 0, .125)'
  },
}
