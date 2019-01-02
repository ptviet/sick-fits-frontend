import calcTotalPrice from '../lib/calcTotalPrice';
import { fakeCartItem } from '../lib/testUtils';

describe('calcTotalPrice func', () => {
  it('should calculate the total price', () => {
    expect(calcTotalPrice([fakeCartItem()])).toBe(15000);
    expect(calcTotalPrice([fakeCartItem(), fakeCartItem()])).toBe(30000);
  });
});
