import { describe, it, expect } from 'vitest';
import { getPlay, beats } from '@engine/rules';

const singleA = ['A♠'];
const single2 = ['2♠'];
const pair55 = ['5♠', '5♥'];
const pair66 = ['6♠', '6♥'];
const bomb4 = ['7♠', '7♥', '7♦', '7♠'];
const bomb5 = ['8♠', '8♥', '8♦', '8♠', '8♥'];
const jokerBomb = ['SJ', 'SJ', 'BJ'];

describe('rules', () => {
  it('parses legal plays', () => {
    expect(getPlay(singleA)?.type).toBe('single');
    expect(getPlay(pair55)?.type).toBe('pair');
    expect(getPlay(bomb4)?.type).toBe('bomb');
    expect(getPlay(jokerBomb)?.type).toBe('bomb');
  });

  it('rejects illegal plays', () => {
    expect(getPlay(['A♠', 'A♥', 'A♦'])).toBeNull();
    expect(getPlay(['SJ', 'BJ'])).toBeNull();
  });

  it('compare plays', () => {
    const pA = getPlay(singleA)!;
    const p2 = getPlay(single2)!;
    expect(beats(pA, p2)).toBe(true);
    const pair5 = getPlay(pair55)!;
    const pair6 = getPlay(pair66)!;
    expect(beats(pair5, pair6)).toBe(true);
    const b4 = getPlay(bomb4)!;
    const b5 = getPlay(bomb5)!;
    expect(beats(pair6, b4)).toBe(true);
    expect(beats(b4, b5)).toBe(true);
    const jb = getPlay(jokerBomb)!;
    expect(beats(b5, jb)).toBe(true);
    expect(beats(b4, jb)).toBe(true);
    expect(beats(jb, b5)).toBe(false);
  });
});
