import { createDeck, Card } from './deck';

export interface DealResult {
  players: Card[][]; // 3 players
  bottom: Card[]; // 6 cards
}

export function dealGame(seed: number | string): DealResult {
  const deck = createDeck(seed);
  const players: Card[][] = [[], [], []];
  for (let i = 0; i < 75; i++) {
    players[i % 3].push(deck[i]);
  }
  const bottom = deck.slice(75);
  return { players, bottom };
}
