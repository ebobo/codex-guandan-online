import type { Card } from './deck';
import { dealGame } from './dealGame';
import { getPlay, beats, Play } from './rules';

export interface GameState {
  hands: Card[][];
  bottom: Card[];
  turn: number; // index of current player
  lastPlay?: { player: number; play: Play };
  finished: boolean;
  payouts: number[]; // length 3
}

export function initGame(seed: number | string): GameState {
  const { players, bottom } = dealGame(seed);
  return {
    hands: players,
    bottom,
    turn: 0,
    finished: false,
    payouts: [0, 0, 0],
  };
}

export interface Move {
  cards: Card[]; // empty array means pass
}

function removeCards(hand: Card[], cards: Card[]): Card[] {
  const copy = hand.slice();
  for (const c of cards) {
    const idx = copy.indexOf(c);
    if (idx === -1) throw new Error('Card not in hand');
    copy.splice(idx, 1);
  }
  return copy;
}

export function play(state: GameState, move: Move): GameState {
  if (state.finished) return state;
  const hand = state.hands[state.turn];
  if (move.cards.length === 0) {
    return {
      ...state,
      turn: (state.turn + 1) % 3,
    };
  }
  const playObj = getPlay(move.cards);
  if (!playObj) throw new Error('Illegal play');
  if (state.lastPlay && !beats(state.lastPlay.play, playObj)) {
    throw new Error('Play does not beat previous');
  }
  const newHand = removeCards(hand, move.cards);
  const hands = state.hands.slice();
  hands[state.turn] = newHand;
  const finished = newHand.length === 0;
  const payouts = finished ? hands.map((_, i) => (i === state.turn ? 1 : -1)) : state.payouts;
  return {
    hands,
    bottom: state.bottom,
    turn: finished ? state.turn : (state.turn + 1) % 3,
    lastPlay: finished ? undefined : { player: state.turn, play: playObj },
    finished,
    payouts,
  };
}
