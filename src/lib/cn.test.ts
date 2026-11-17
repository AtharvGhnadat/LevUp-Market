import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn utility', () => {
  it('merges class names cleanly', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('handles conditional falsy expressions', () => {
    expect(cn('base-class', false && 'hidden', undefined, null, 'active')).toBe('base-class active');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });
});
