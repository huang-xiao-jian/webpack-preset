/**
 * @description - declare webpack development configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const path = require('path');
const _ = require('lodash');

const webpack = require('webpack');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectExternalPlugin = require('webpack-plugin-inject-external');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer');
// internal
// @todo - use more necessary plugins
const postcssPlugins = require('./postcss.config');

/**
 * @typedef {object} Options
 *
 * @property {string} entry
 * @property {string} homepage
 * @property {string} target
 * @property {string} title
 */
const defaultOptions = {
  target: 'web',
  entry: './src/main.js',
  homepage: '/',
  // for html-webpack-plugin
  title: '@coco-platform/webpack-preset',
};

module.exports = function webpackDevelopmentPreset(env = {}) {
  /**
   * @type {Options}
   */
  const options = _.extend({}, defaultOptions, env);

  return {
    mode: 'development',
    target: options.target,
    entry: {
      main: require.resolve(process.cwd(), options.entry),
    },
    output: {
      path: path.resolve(process.cwd(), 'dist', 'client'),
      publicPath: options.homepage,
      filename: 'static/script/[name].bundle.js',
      chunkFilename: 'static/script/[id]_[name].chunk.js',
      crossOriginLoading: 'anonymous',
    },
    resolve: {
      extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
      alias: {},
    },
    module: {
      noParse: [/\.min\.js/],
      strictExportPresence: true,
      rules: [
        {
          test: /\.(js|mjs|jsx)$/,
          enforce: 'pre',
          use: [{ loader: 'eslint-loader' }],
        },
        {
          test: /\.(js|jsx|mjs)$/,
          include: path.resolve(process.cwd(), 'src'),
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.p?css$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                root: path.resolve(process.cwd(), 'src'),
                modules: true,
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: postcssPlugins,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: path.resolve(process.cwd(), 'src'),
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                root: path.resolve(process.cwd(), 'src'),
                importLoaders: 1,
              },
            },
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(png|jpe?g|gif|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/,
          loader: 'file-loader',
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      new CaseSensitivePathsPlugin(),
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        openAnalyzer: false,
      }),
      new WatchMissingNodeModulesPlugin(path.resolve('node_modules')),
      new webpack.ContextReplacementPlugin([/moment\/locale$/, /zh-cn/]),
      new HtmlWebpackPlugin({
        title: options.title,
        inject: 'body',
        template: path.resolve(process.cwd(), 'public', 'index.html'),
        favicon: path.join(process.cwd(), 'public', 'favicon.ico'),
      }),
      // @todo - allow dynamic request remote definition
      new InjectExternalPlugin({}),
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
    },
    devtool: 'cheap-module-source-map',
    devServer: {
      host: '0.0.0.0',
      open: true,
      quite: true,
      contentBase: path.resolve(process.cwd(), 'public'),
      watchContentBase: true,
      disableHostCheck: true,
    },
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
