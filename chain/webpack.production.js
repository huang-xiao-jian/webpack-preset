/* eslint-disable indent */
/**
 * =============================================================================
 * webpack production configuration
 * =============================================================================
 */

// packages
const webpack = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InjectExternalPlugin = require('@coco-platform/webpack-plugin-inject-external');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlMinifyPlugin = require('@coco-platform/webpack-plugin-html-minify');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Config = require('webpack-chain');
// scope
const production = new Config();

/* mode */
production.mode('production').target('web');

/* output */
production.output
  .path('./dist/client')
  .publicPath('/')
  .filename('static/script/[name].[chunkhash:8].js')
  .chunkFilename('static/script/[id]_[name]_[chunkhash:8].chunk.js')
  .crossOriginLoading(true);

/* resolve */
production.resolve.extensions
  .add('.js')
  .add('.jsx')
  .add('.mjs')
  .add('.tx')
  .add('.tsx');

/* module */
production.module.noParse(/\.min\.js/);
production.module
  .rule('js|jsx|ts|tsx')
  .test(/\.(js|jsx|mjs|mjsx|ts|tsx)$/)
  .exclude.add(/node_modules/)
  .end()
  .include.add('./src')
  .end()
  .use('babel')
  .loader('babel-loader')
  .options({ cacheDirectory: true });
production.module
  .rule('css|pcss')
  .test(/\.p?css$/)
  .exclude.add(/node_modules/)
  .end()
  .use('MiniExtract')
  .loader(MiniCssExtractPlugin.loader)
  .end()
  .use('css')
  .loader('css-loader')
  .options({
    root: './src',
    modules: false,
    importLoaders: 1,
    localIdentName: '[name]__[local]__[hash:base64:5]',
  })
  .end()
  .use('postcss')
  .loader('postcss-loader')
  .end();
production.module
  .rule('css')
  .test(/\.css$/)
  .exclude.add('./src')
  .add('./public')
  .end()
  .use('MiniExtract')
  .loader(MiniCssExtractPlugin.loader)
  .end()
  .use('css')
  .loader('css-loader')
  .end();

production.module
  .rule('assets')
  .test(/\.(png|jpe?g|gif|bmp|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/)
  .use('file')
  .loader('file-loader')
  .options({
    name: 'static/media/[name].[hash:8].[ext]',
  })
  .end();

/* plugins */
production.plugin('Progress').use(ProgressBarPlugin);
production.plugin('CaseSensitive').use(CaseSensitivePathsPlugin);
production
  .plugin('ContextReplacement')
  .use(webpack.ContextReplacementPlugin, [/moment\/locale$/, /zh-cn/]);
production.plugin('HTML').use(HtmlWebpackPlugin, [
  {
    inject: 'body',
    template: './public/index.html',
  },
]);
production.plugin('MiniCssExtract').use(MiniCssExtractPlugin, [
  {
    filename: 'static/stylesheet/[name].[hash].css',
    chunkFilename: 'static/stylesheet/[id].[hash].chunk.css',
  },
]);
production.plugin('Compress').use(CompressionPlugin, [
  {
    test: /\.(js|css|html)$/,
    threshold: 1024,
    minRatio: 0.85,
  },
]);
production.plugin('Compress').use(HtmlMinifyPlugin, []);
production.plugin('BundleAnalyzer').use(BundleAnalyzerPlugin, [
  {
    analyzerMode: 'static',
    openAnalyzer: false,
    reportFilename: '../analyzer/index.html',
  },
]);

/* devtools */
production.devtool('source-map');

/* node */
production.node
  .set('net', 'empty')
  .set('dgram', 'empty')
  .set('fs', 'empty')
  .set('crypto', 'empty')
  .set('child_process', 'empty')
  .set('tls', 'empty');

/* optimization */
production.optimization.runtimeChunk({ name: 'manifest' }).minimize(true);
production.optimization.minimizer('Uglifyjs').use(UglifyJsPlugin, [
  {
    cache: true,
    parallel: true,
    sourceMap: true, // set to true if you want JS source maps
  },
]);
production.optimization.minimizer('CSS').use(OptimizeCSSAssetsPlugin, []);

module.exports = production;
