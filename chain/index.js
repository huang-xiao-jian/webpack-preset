/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

/**
 * @typedef {object} DependencyMeta
 *
 * @property {string} name
 * @property {string} dependency
 * @property {boolean} destruct
 * @
 */

const development = require('./webpack.development');
const production = require('./webpack.production');

module.exports = {
  development,
  production,
};
