import { describe, it, expect } from 'vitest';
import { normalizeText, levenshteinRatio } from './utils';

describe('normalizeText', () => {
  it('normaliza a minúsculas y quita espacios extras', () => {
    expect(normalizeText('  Hello   World  ')).toBe('hello world');
  });

  it('normaliza diacríticos', () => {
    expect(normalizeText('café')).toBe('cafe');
  });
});

describe('levenshteinRatio', () => {
  it('retorna 1 para strings idénticos', () => {
    expect(levenshteinRatio('hello', 'hello')).toBe(1);
  });

  it('retorna 0 cuando uno está vacío', () => {
    expect(levenshteinRatio('hello', '')).toBe(0);
  });

  it('retorna ratio entre 0 y 1 para strings similares', () => {
    const r = levenshteinRatio('hello', 'hallo');
    expect(r).toBeGreaterThan(0);
    expect(r).toBeLessThanOrEqual(1);
  });
});
