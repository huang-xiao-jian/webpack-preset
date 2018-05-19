/**
 * @description - suits example
 * @author - huang.jian <hjj491229492@hotmail.com>
 */

const sum = require('../lib');

describe('simple suits', () => {
  it('simple case', () => {
    expect(sum(1, 2, 3)).toEqual(6);
  });
});
