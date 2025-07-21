import React, { useMemo } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Socket } from 'socket.io-client';
import type { Card } from '@engine/stateMachine';
import { useGameState } from '../hooks/useGameState';
import { PayoutModal } from './PayoutModal';
import { WinnerToast } from './WinnerToast';

interface CardProps {
  card: Card;
}
function DraggableCard({ card }: CardProps) {
  const [, drag] = useDrag(() => ({ type: 'CARD', item: { card } }));
  return (
    <div ref={drag} className="card">
      {card}
    </div>
  );
}

interface AreaProps {
  onDrop(cards: Card[]): void;
  children: React.ReactNode;
}
function PlayArea({ onDrop, children }: AreaProps) {
  const [, drop] = useDrop(() => ({
    accept: 'CARD',
    drop: (item: { card: Card }) => onDrop([item.card]),
  }));
  return (
    <div ref={drop} className="play-area">
      {children}
    </div>
  );
}

interface Props {
  socket: Socket | null;
  roomId: string;
}

export function Game({ socket, roomId }: Props) {
  const state = useGameState(socket, roomId);
  const winner = useMemo(() => (state?.finished ? state.turn : null), [state]);

  function play(cards: Card[]) {
    if (socket) socket.emit('playCards', { roomId, cards });
  }

  function restart() {
    if (socket) socket.emit('startGame', { roomId, seed: Date.now() });
  }

  if (!state) return <div>Waiting for game...</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="turn-indicator">Turn: Player {state.turn + 1}</div>
      <div className="hand">
        {state.hands[0].map((c) => (
          <DraggableCard key={c} card={c} />
        ))}
      </div>
      <PlayArea onDrop={play}>
        {state.lastPlay && (
          <div>Last: {state.lastPlay.play.cards.join(' ')}</div>
        )}
      </PlayArea>
      <WinnerToast winner={winner} />
      <PayoutModal payouts={state.payouts} open={state.finished} onRestart={restart} />
    </DndProvider>
  );
}
