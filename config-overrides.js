const webpack = require('webpack');
const packageJson = require('./package.json');

const esModules = [
  'js-combinatorics',
]

function getBuildInfo() {
  let commitHash = require('child_process')
    .execSync('git rev-parse --short HEAD')
    .toString();

  return {
    commitHash,
    version: packageJson.version
  }

}

module.exports = {
  jest: (config) => {
    config.transformIgnorePatterns = [ `<rootDir>/node_modules/(?!${esModules.join('|')})` ]
    return config
  },
  webpack: (config) => {
    const info = getBuildInfo()
    config.output.publicPath = './'
    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(info.commitHash),
        __VERSION__: JSON.stringify(info.version)
      })
    ]
    return config
  }
}
