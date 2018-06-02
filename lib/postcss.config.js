/**
 * @description - postcss options
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const autoprefixer = require('autoprefixer');
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
  ],
};
