/**
 * @description - webpack development configuration
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

// packages
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const InjectExternalPlugin = require('@coco-platform/webpack-plugin-inject-external');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * @typedef {object} PresetOptions
 *
 * @property {string} target
 * @property {string} entry
 * @property {string} homepage
 * @property {string} definition - bootcdn library reflection
 * @property {boolean} typescript
 * @property {object} css
 * @property {boolean} css.modules
 */
const options = {
  target: 'web',
  entry: './src/main.js',
  homepage: '/',
  typescript: false,
  css: {
    modules: true,
  },
};

// typescript related plugins
const TSOptimalPlugins = [
  new webpack.WatchIgnorePlugin([/\.js$/, /\.d\.ts$/]),
  new ForkTsCheckerWebpackPlugin(),
];
const TSPlugins = options.typescript ? TSOptimalPlugins : [];

module.exports = {
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
    extensions: ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.json'],
    alias: {},
  },
  module: {
    noParse: [/\.min\.js/],
    rules: [
      {
        test: /\.(js|jsx|mjs|mjsx|ts|tsx)$/,
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
        test: /\.p?css$/,
        exclude: /node_modules/,
        use: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              root: path.resolve(process.cwd(), 'src'),
              modules: options.css.modules,
              importLoaders: 1,
              localIdentName: '[name]__[local]__[hash:base64:5]',
            },
          },
          {
            loader: require.resolve('postcss-loader'),
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
