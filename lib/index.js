/**
 * @description - @coco-platform/init-cli generated template
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

module.exports = function sum(...variables) {
  const numbers = Array.from(variables);

  return numbers.reduce((acc, curr) => acc + curr, 0);
};
