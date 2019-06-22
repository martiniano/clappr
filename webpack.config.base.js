const path = require('path')
const webpack = require('webpack')

const DirectoryNamedWebpackPlugin = require('directory-named-webpack-plugin')

const webpackConfig = (config) => {
  return {
    devServer: {
      contentBase: [
        path.resolve(__dirname, 'public'),
      ],
      disableHostCheck: true, // https://github.com/webpack/webpack-dev-server/issues/882
      compress: true,
      host: '0.0.0.0',
      port: 8080
    },
    mode: config.mode,
    devtool: config.devtool || 'source-maps',
    optimization: config.optimization,
    entry: path.resolve(__dirname, 'src/main.js'),
    externals: config.externals,
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          exclude: [path.resolve(__dirname, './node_modules')]
        },
        {
          test: /\.scss$/,
          loaders: ['style-loader?singleton=true', 'css-loader', 'postcss-loader', 'sass-loader?includePaths[]='
            + path.resolve(__dirname, './src/base/scss')
          ],
          include: path.resolve(__dirname, 'src')
        },
        {
          test: /\.html/, loader: 'html-loader?minimize=false'
        },
        ...(config.rules || [])
      ],
    },
    resolve: {
      alias: {
        'clappr-zepto': 'clappr-zepto/zepto.js'
      },
      plugins: [
        new DirectoryNamedWebpackPlugin(true),
      ],
      modules: ['node_modules']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'dist/',
      filename: config.filename,
      library: 'Clappr',
      libraryTarget: 'umd'
    },
    plugins: [
      new webpack.DefinePlugin({
        VERSION: JSON.stringify(require('./package.json').version),
      }),
      ...(config.plugins || [])
    ],
  }
}

module.exports = webpackConfig
