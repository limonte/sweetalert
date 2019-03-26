const isCI = require('is-ci')

const noLaunch = process.argv.includes('--no-launch')
const isWindows = process.platform === 'win32'
const testMinified = process.argv.includes('--minified')
const isSauce = process.argv.includes('--sauce')
const isNetlify = process.argv.includes('--netlify')

const webpackConfig = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {/* babel options */}
        }
      }
    ]
  }
}

const karmaPlugins = [
  'karma-coverage',
  'karma-webpack',
  'karma-qunit',
  'karma-spec-reporter',
  'karma-sourcemap-loader',
  'karma-chrome-launcher',
  'karma-firefox-launcher',
  'karma-ie-launcher',
  'karma-sauce-launcher'
]

const preprocessors = {
  'test/qunit/**/*.js': [
    'webpack',
    'sourcemap'
  ],
  'dist/*.js': [
    'coverage'
  ]
}

const coverageReporter = {
  dir: 'coverage',
  reporters: [
    { type: 'html', subdir: '.' },
    { type: 'lcov', subdir: '.' }
  ]
}

const sauceLabsLaunchers = {
  safari: {
    base: 'SauceLabs',
    browserName: 'Safari',
    version: 'latest',
    // TODO(@limonte): remove this line, the current latest 10.14 doesn't work (#1349)
    platform: 'macOS 10.13'
  },
  edge: {
    base: 'SauceLabs',
    browserName: 'MicrosoftEdge',
    version: 'latest'
  },
  iphone: {
    base: 'SauceLabs',
    browserName: 'Safari',
    deviceName: 'iPhone Simulator',
    platformName: 'iOS',
    platformVersion: 'latest'
  },
  android: {
    base: 'SauceLabs',
    deviceName: 'Android GoogleAPI Emulator',
    browserName: 'Chrome',
    platformName: 'Android',
    platformVersion: 'latest'
  }
}

function checkSauceCredentials() {
  if (!process.env.SAUCE_USERNAME || !process.env.SAUCE_ACCESS_KEY) {
    console.error('SAUCE_USERNAME and SAUCE_ACCESS_KEY environment variables must be set')
    process.exit(1)
  }
}

function getFiles () {
  let files
  if (testMinified) {
    files = [
      'dist/sweetalert2.all.min.js'
    ]
  } else {
    files = [
      'dist/sweetalert2.css',
      'dist/sweetalert2.js'
    ]
  }
  return files.concat([
    'node_modules/promise-polyfill/dist/polyfill.min.js',
    'test/qunit/**/*.js'
  ])
}

function getBrowsers () {
  if (noLaunch) {
    return []
  }

  // Cron on Travis or check:qunit --sauce
  if (isSauce) {
    checkSauceCredentials()
    return Object.keys(sauceLabsLaunchers)

  // Netlify
  } else if (isNetlify) {
    process.env.CHROME_BIN = require('puppeteer').executablePath()
    return ['ChromeHeadless']

  // AppVeyor
  } else if (isCI && isWindows) {
    return ['IE', 'ChromeHeadless', 'FirefoxHeadless']

  // Travis
  } else if (isCI) {
    return ['ChromeHeadless', 'FirefoxHeadless']

  // Local development
  } else {
    return ['ChromeHeadless']
  }
}

function getReporters () {
  const reporters = ['spec', 'saucelabs']

  // Travis
  if (isCI && !isWindows && !testMinified) {
    reporters.push('coverage')
  }

  return reporters
}

module.exports = function (config) {
  config.set({
    port: 3000,
    plugins: karmaPlugins,

    frameworks: ['qunit'],
    qunit: { reorder: false },

    customLaunchers: sauceLabsLaunchers,

    files: getFiles(),
    browsers: getBrowsers(),
    reporters: getReporters(),
    preprocessors,
    coverageReporter,

    webpack: webpackConfig,
    webpackMiddleware: {
      stats: 'errors-only'
    },

    captureTimeout: 360000,
    browserNoActivityTimeout: 360000
  })
}
