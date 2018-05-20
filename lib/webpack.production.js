/**
 * @description - declare webpack development configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
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
 * @property {string} sourceMapHost
 */
const defaultOptions = {
  target: 'web',
  entry: './src/main.js',
  homepage: '/',
  // for html-webpack-plugin
  title: '@coco-platform/webpack-preset',
  sourceMapHost: '/',
};

module.exports = function webpackDevelopmentPreset(env = {}) {
  /**
   * @type {Options}
   */
  const options = _.extend({}, defaultOptions, env);

  return {
    mode: 'production',
    target: options.target,
    entry: {
      main: path.resolve(process.cwd(), options.entry),
    },
    output: {
      path: path.resolve(process.cwd(), 'dist', 'client'),
      publicPath: options.homepage,
      filename: 'static/script/[name].[chunkhash:8].js',
      chunkFilename: 'static/script/[id]_[chunkhash:8].chunk.js',
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
          test: /\.(js|jsx|mjs)$/,
          include: path.resolve(process.cwd(), 'src'),
          loader: require.resolve('babel-loader'),
          options: {
            cacheDirectory: true,
          },
        },
        {
          test: /\.p?css$/,
          exclude: /node_modules/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: require.resolve('css-loader'),
              options: {
                root: path.resolve(process.cwd(), 'src'),
                modules: true,
                camelCase: 'only',
                importLoaders: 1,
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
            },
            {
              loader: require.resolve('postcss-loader'),
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
            MiniCssExtractPlugin.loader,
            { loader: require.resolve('css-loader') },
          ],
        },
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
          loader: require.resolve('url-loader'),
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(png|jpe?g|gif|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
      ],
    },
    plugins: [
      new ProgressBarPlugin(),
      new CaseSensitivePathsPlugin(),
      new MiniCssExtractPlugin({
        filename: 'static/stylesheet/[name].[hash].css',
        chunkFilename: 'static/stylesheet/[id].[hash].chunk.css',
      }),
      new webpack.ContextReplacementPlugin([/moment\/locale$/, /zh-cn/]),
      new HtmlWebpackPlugin({
        title: options.title,
        inject: 'body',
        template: path.resolve(process.cwd(), 'public', 'index.html'),
        favicon: path.join(process.cwd(), 'public', 'favicon.ico'),
      }),
      new ZopfliPlugin({
        asset: '[path].gz[query]',
        algorithm: 'zopfli',
        test: /\.(js|css|html)$/,
        threshold: 2048,
        minRatio: 0.85,
      }),
      // @todo - allow dynamic define external resources
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: '../analyzer/index.html',
        openAnalyzer: false,
      }),
    ],
    optimization: {
      runtimeChunk: {
        name: 'manifest',
      },
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true, // set to true if you want JS source maps
        }),
        new OptimizeCSSAssetsPlugin({}),
      ],
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
