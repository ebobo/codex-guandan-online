import type { Card } from './deck';

export const RANK_ORDER = [
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
  '2',
  'SJ',
  'BJ',
] as const;

export type Rank = (typeof RANK_ORDER)[number];

function rankValue(rank: Rank): number {
  return RANK_ORDER.indexOf(rank);
}

export function cardRank(card: Card): Rank {
  if (card === 'SJ' || card === 'BJ') return card as Rank;
  // card like 'A♠'
  return card.replace(/[♠♥♦]/, '') as Rank;
}

export interface Single {
  type: 'single';
  rank: Rank;
  cards: [Card];
}

export interface Pair {
  type: 'pair';
  rank: Rank;
  cards: [Card, Card];
}

export interface Bomb {
  type: 'bomb';
  rank: Rank | 'JOKER';
  cards: Card[]; // length 4-6 or 3 jokers
}

export type Play = Single | Pair | Bomb;

export function isSingle(cards: Card[]): cards is [Card] {
  return cards.length === 1;
}

export function isPair(cards: Card[]): cards is [Card, Card] {
  return cards.length === 2 && cardRank(cards[0]) === cardRank(cards[1]);
}

function isRegularBomb(cards: Card[]): boolean {
  if (cards.length < 4 || cards.length > 6) return false;
  const r = cardRank(cards[0]);
  return cards.every((c) => cardRank(c) === r);
}

function isJokerBomb(cards: Card[]): boolean {
  if (cards.length !== 3) return false;
  return cards.every((c) => c === 'SJ' || c === 'BJ');
}

export function getPlay(cards: Card[]): Play | null {
  const sorted = cards.slice();
  if (isSingle(sorted)) {
    return { type: 'single', rank: cardRank(sorted[0]), cards: sorted };
  }
  if (isPair(sorted)) {
    return { type: 'pair', rank: cardRank(sorted[0]), cards: sorted };
  }
  if (isJokerBomb(sorted)) {
    return { type: 'bomb', rank: 'JOKER', cards: sorted };
  }
  if (isRegularBomb(sorted)) {
    return { type: 'bomb', rank: cardRank(sorted[0]), cards: sorted };
  }
  return null;
}

export function compareSingle(a: Single, b: Single): number {
  return rankValue(b.rank) - rankValue(a.rank);
}

export function comparePair(a: Pair, b: Pair): number {
  return rankValue(b.rank) - rankValue(a.rank);
}

function bombStrength(b: Bomb): number {
  if (b.rank === 'JOKER') return 100;
  return b.cards.length * 10 + rankValue(b.rank);
}

export function compareBomb(a: Bomb, b: Bomb): number {
  return bombStrength(b) - bombStrength(a);
}

export function beats(prev: Play, next: Play): boolean {
  if (next.type === 'bomb' && prev.type !== 'bomb') return true;
  if (prev.type === 'bomb' && next.type !== 'bomb') return false;
  if (prev.type === 'single' && next.type === 'single') {
    return compareSingle(prev, next) > 0;
  }
  if (prev.type === 'pair' && next.type === 'pair') {
    return comparePair(prev, next) > 0;
  }
  if (prev.type === 'bomb' && next.type === 'bomb') {
    return compareBomb(prev, next) > 0;
  }
  return false;
}
