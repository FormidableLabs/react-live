import cn from '../cn';

describe('cn', () => {
  it('joins classnames', () => {
    expect(cn()).toBe('');
    expect(cn('a')).toBe('a');
    expect(cn('a', 'b')).toBe('a b');
  });
});
