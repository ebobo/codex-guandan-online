import { describe, it, expect } from 'vitest';
import { createDeck } from '@engine/deck';

describe('deck', () => {
  it('generates 81 cards with no clubs and one big joker', () => {
    const deck = createDeck(42);
    expect(deck).toHaveLength(81);
    for (const card of deck) {
      expect(card.includes('♣')).toBe(false);
    }
    const bigJokers = deck.filter((c) => c === 'BJ');
    expect(bigJokers).toHaveLength(1);
  });
});
