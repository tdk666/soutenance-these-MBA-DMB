import { describe, expect, it } from 'vitest';
import { formatEcart, msToTc, tcToMs } from './timecode';

describe('timecode', () => {
  it('parse les cibles du script', () => {
    expect(tcToMs('0:00')).toBe(0);
    expect(tcToMs('8:04')).toBe(484_000);
    expect(tcToMs('13:04')).toBe(784_000);
    expect(tcToMs('30:04')).toBe(1_804_000);
    expect(tcToMs('~8:50')).toBe(530_000);
  });

  it('rejette les formats invalides', () => {
    expect(() => tcToMs('8:4')).toThrow();
    expect(() => tcToMs('8:61')).toThrow();
    expect(() => tcToMs('804')).toThrow();
  });

  it('formate les durées et les écarts', () => {
    expect(msToTc(484_000)).toBe('8:04');
    expect(formatEcart(50_000)).toBe('+0:50');
    expect(formatEcart(-65_000)).toBe('−1:05');
    expect(formatEcart(0)).toBe('+0:00');
  });
});
