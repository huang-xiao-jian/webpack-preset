/**
 * @description - postcss options
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const autoprefixer = require('autoprefixer');
const PXToViewport = require('postcss-px-to-viewport');
const nested = require('postcss-nested');
const flexbugs = require('postcss-flexbugs-fixes');

module.exports = {
  plugins: [
    flexbugs(),
    nested(),
    autoprefixer({
      browsers: [
        '>1%',
        'last 4 versions',
        'Firefox ESR',
        'not ie <= 9', // React doesn't support IE8 anyway
      ],
    }),
    PXToViewport({
      viewportWidth: 375,
      viewportHeight: 667,
      unitPrecision: 5,
      selectorBlackList: [/^\.button$/, /^\.full$/],
    }),
  ],
};
