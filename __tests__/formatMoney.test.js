import formatMoney from '../lib/formatMoney';

describe('formatMoney func', () => {
  it('should format the money input', () => {
    expect(formatMoney(1000)).toBe('$10');
    expect(formatMoney(1001)).toBe('$10.01');
    expect(formatMoney(895)).toBe('$8.95');
    expect(formatMoney(95)).toBe('$0.95');
  });
});
