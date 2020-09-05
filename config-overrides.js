const esModules = [
  'js-combinatorics',
]
module.exports = {
  jest: (config) => {
    config.transformIgnorePatterns = [ `<rootDir>/node_modules/(?!${esModules.join('|')})` ]
    return config
  }
}
