import { add } from '../src/util/add';

describe('add', () => {
  it('adds numbers', () => {
    expect(add(1, 2)).toBe(3);
  });
});
