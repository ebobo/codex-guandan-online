import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { play } from '@engine/stateMachine';
import type { GameState } from '@engine/stateMachine';

describe('stateMachine', () => {
  it('game ends when someone empties hand', () => {
    fc.assert(
      fc.property(fc.constantFrom('A♠', '2♠', 'SJ'), (card) => {
        const state: GameState = {
          hands: [[card], ['X'], ['Y']],
          bottom: [],
          turn: 0,
          finished: false,
          payouts: [0, 0, 0],
        };
        const next = play(state, { cards: [card] });
        expect(next.finished).toBe(true);
        expect(next.payouts[0]).toBe(1);
      })
    );
  });
});
