const webpack = require('webpack');
const packageJson = require('./package.json');
const { InjectManifest } = require('workbox-webpack-plugin');

const { rewireWorkboxGenerate, defaultGenerateConfig } = require('react-app-rewire-workbox');
const path = require('path');

const esModules = [
  'js-combinatorics',
]

function getBuildInfo() {
  let [ commitHash, isoDate ] = require('child_process')
    .execSync("git show --no-patch --no-notes --pretty='%h;%cI' HEAD")
    .toString().trim().split(";");

  return {
    commitHash,
    isoDate,
    version: packageJson.version
  }

}

module.exports = {
  jest: (config) => {
    config.transformIgnorePatterns = [ `<rootDir>/node_modules/(?!${esModules.join('|')})` ]
    return config
  },
  webpack: (config, env) => {
    const info = getBuildInfo()
    config.output.publicPath = './'
    config.plugins = [
      ...config.plugins,
      new webpack.DefinePlugin({
        __COMMIT_HASH__: JSON.stringify(info.commitHash),
        __VERSION__: JSON.stringify(info.version),
        __COMMIT_DATE__: JSON.stringify(info.isoDate)
      })
    ]
    config.module.rules.push(
      {
        test: /\.md$/i,
        use: 'raw-loader',
      },
    )
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
    }

    const workboxConfig = {
      ...defaultGenerateConfig,
      swDest: path.join(__dirname, 'build', 'pwa-sw.js'),
      // Важный момент чтобы срабатывал рефреш.
      skipWaiting: true,
      // Define runtime caching rules.
      runtimeCaching: [ {
        urlPattern: new RegExp('/'),
        handler: 'StaleWhileRevalidate',
        options: {},
      } ],

    };
    config = rewireWorkboxGenerate(workboxConfig)(config, env);

    return config
  }
}
