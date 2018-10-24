/**
 * =============================================================================
 * webpack development configuration
 * =============================================================================
 */

// packages
const { ContextReplacementPlugin } = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const Config = require('webpack-chain');
// scope
const development = new Config();
/**
 * @type {Array<DependencyMeta>}
 */
const dependencies = [
  {
    name: 'CaseSensitivePathsPlugin',
    dependency: 'case-sensitive-paths-webpack-plugin',
  },
  {
    name: 'HtmlWebpackPlugin',
    dependency: 'html-webpack-plugin',
  },
  {
    name: 'ContextReplacementPlugin',
    dependency: 'webpack',
    destruct: true,
  },
  {
    name: 'BundleAnalyzerPlugin',
    dependency: 'webpack-bundle-analyzer',
    destruct: true,
  },
];

/* mode */
development.mode('development').target('web');

/* entry */
development.entry('main').add('./src/main.js');

/* output */
development.output
  .path('./dist/client')
  .publicPath('/')
  .filename('static/script/[name].bundle.js')
  .chunkFilename('static/script/[id]_[name].chunk.js')
  .crossOriginLoading(true);

/* resolve */
development.resolve.extensions
  .add('.js')
  .add('.jsx')
  .add('.mjs')
  .add('.tx')
  .add('.tsx');

/* module */
development.module.noParse(/\.min\.js/);
development.module
  .rule('js|jsx|ts|tsx')
  .test(/\.(js|jsx|mjs|mjsx|ts|tsx)$/)
  .exclude.add(/node_modules/)
  .end()
  .include.add('./src')
  .end()
  .use('babel')
  .loader('babel-loader')
  .options({ cacheDirectory: true });
development.module
  .rule('css|pcss')
  .test(/\.p?css$/)
  .exclude.add(/node_modules/)
  .end()
  .use('style')
  .loader('style-loader')
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
development.module
  .rule('css')
  .test(/\.css$/)
  .exclude.add('./src')
  .add('./public')
  .end()
  .use('style')
  .loader('style-loader')
  .end()
  .use('css')
  .loader('css-loader')
  .end();
development.module
  .rule('assets')
  .test(/\.(png|jpe?g|gif|bmp|mp3|woff|woff2|ttf|eot|svg)(\?.*)?$/)
  .use('file')
  .loader('file-loader')
  .options({
    name: 'static/media/[name].[hash:8].[ext]',
  })
  .end();

/* plugins */
development.plugin('CaseSensitive').use(CaseSensitivePathsPlugin);
development
  .plugin('ContextReplacement')
  .use(ContextReplacementPlugin, [/moment\/locale$/, /zh-cn/]);
development.plugin('HTML').use(HtmlWebpackPlugin, [
  {
    inject: 'body',
    template: './public/index.html',
  },
]);
development.plugin('BundleAnalyzer').use(BundleAnalyzerPlugin, [
  {
    analyzerMode: 'server',
    openAnalyzer: false,
    reportFilename: '../analyzer/index.html',
  },
]);

/* devtools */
development.devtool('cheap-module-source-map');

/* node */
development.node
  .set('net', 'empty')
  .set('dgram', 'empty')
  .set('fs', 'empty')
  .set('crypto', 'empty')
  .set('child_process', 'empty')
  .set('tls', 'empty');

/* optimization */
development.optimization.runtimeChunk({ name: 'manifest' });

module.exports = development;
module.exports.dependencies = dependencies;
