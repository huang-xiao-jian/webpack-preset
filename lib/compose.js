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
const defaultOptions = {
  target: 'web',
  entry: './src/main.js',
  homepage: '/',
  typescript: false,
  css: {
    modules: true,
  },
};

module.exports = (factory) => (options = {}) =>
  factory({ ...defaultOptions, ...options });
