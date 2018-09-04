/**
 * @description - declare webpack development configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const InjectExternalPlugin = require('@coco-platform/webpack-plugin-inject-external');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// internal
// @todo - use more necessary plugins
const { plugins } = require('./postcss.config');

/**
 * @typedef {object} Options
 *
 * @property {string} entry
 * @property {string} homepage
 * @property {string} target
 * @property {string} title
 * @property {string} definition
 * @property {boolean} typescript
 * @property {object} postcss
 * @property {Array} postcss.plugins
 */
const defaultOptions = {
  target: 'web',
  entry: './src/main.js',
  homepage: '/',
  // for html-webpack-plugin
  title: '@coco-platform/webpack-preset',
  typescript: false,
  postcss: {
    plugins: [],
  },
};

module.exports = function webpackDevelopmentPreset(env = {}) {
  /**
   * @type {Options}
   */
  const options = { ...defaultOptions, ...env };
  /* eslint-disable indent */
  const TSPlugins = options.typescript
    ? [
        new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
        new ForkTsCheckerWebpackPlugin(),
      ]
    : [];
  /* eslint-enable indent */

  return {
    mode: 'development',
    target: options.target,
    entry: {
      main: path.resolve(process.cwd(), options.entry),
    },
    output: {
      path: path.resolve(process.cwd(), 'dist', 'client'),
      publicPath: options.homepage,
      filename: 'static/script/[name].bundle.js',
      chunkFilename: 'static/script/[id]_[name].chunk.js',
      crossOriginLoading: 'anonymous',
    },
    resolve: {
      extensions: [
        '.js',
        '.jsx',
        '.mjs',
        '.json',
        '.ts',
        '.tsx',
        '.web.js',
        '.web.jsx',
      ],
      alias: {},
    },
    module: {
      noParse: [/\.min\.js/],
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|jsx|mjs)$/,
          exclude: /node_modules/,
          include: path.resolve(process.cwd(), 'src'),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
              },
            },
          ],
        },
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          include: path.resolve(process.cwd(), 'src'),
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
              },
            },
            {
              loader: require.resolve('ts-loader'),
              options: {
                // disable type checker - we will use it in fork plugin
                transpileOnly: true,
              },
            },
          ],
        },
        {
          test: /\.p?css$/,
          exclude: /node_modules/,
          use: [
            require.resolve('style-loader'),
            {
              loader: require.resolve('css-loader'),
              options: {
                root: path.resolve(process.cwd(), 'src'),
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]__[hash:base64:5]',
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                ident: 'postcss',
                plugins: options.postcss.plugins.length
                  ? options.postcss.plugins
                  : plugins,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: [
            path.resolve(process.cwd(), 'src'),
            path.resolve(process.cwd(), 'public'),
          ],
          use: [
            { loader: require.resolve('style-loader') },
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|bmp|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/,
          use: [
            {
              loader: require.resolve('file-loader'),
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
    plugins: [
      ...TSPlugins,
      new CaseSensitivePathsPlugin(),
      new webpack.ContextReplacementPlugin(/moment\/locale$/, /zh-cn/),
      new HtmlWebpackPlugin({
        title: options.title,
        inject: 'body',
        template: path.resolve(process.cwd(), 'public', 'index.html'),
        favicon: path.join(process.cwd(), 'public', 'favicon.ico'),
      }),
      new InjectExternalPlugin({
        env: 'development',
        definition: options.definition,
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: false,
        reportFilename: '../analyzer/index.html',
      }),
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
    },
    devtool: 'cheap-module-source-map',
    node: {
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      crypto: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
};
