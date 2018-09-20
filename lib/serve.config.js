/**
 * @description - webpack server configurations
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const proxy = require('http-proxy-middleware');

module.exports = {
  add: (app) => {
    app.use(
      convert(proxy('/story', { target: 'https://story.babycherry.cn' }))
    );
    app.use(convert(history()));
  },
};
