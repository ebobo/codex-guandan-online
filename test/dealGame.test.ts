import { describe, it, expect } from 'vitest';
import { dealGame } from '@engine/dealGame';

describe('dealGame', () => {
  it('deals 25 cards each and 6 bottom', () => {
    const { players, bottom } = dealGame(42);
    expect(players).toHaveLength(3);
    players.forEach((p) => expect(p).toHaveLength(25));
    expect(bottom).toHaveLength(6);
  });

  it('is deterministic with same seed', () => {
    const a = dealGame('seed');
    const b = dealGame('seed');
    expect(a).toEqual(b);
  });
});
