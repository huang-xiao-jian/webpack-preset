/**
 * @description - bundle webpack factory
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const development = require('./webpack.development');
const production = require('./webpack.production');
const compose = require('./compose');

module.exports = {
  development: compose(development),
  production: compose(production),
};
