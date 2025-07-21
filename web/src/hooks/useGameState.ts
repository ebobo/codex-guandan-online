import { useEffect, useState } from 'react';
import type { GameState } from '@engine/stateMachine';
import type { Socket } from 'socket.io-client';

export function useGameState(socket: Socket | null, roomId: string | null) {
  const [state, setState] = useState<GameState | null>(null);

  useEffect(() => {
    if (!socket || !roomId) return;
    const onState = (s: GameState) => setState(s);
    socket.on('state', onState);
    socket.emit('sync', { roomId });
    return () => {
      socket.off('state', onState);
    };
  }, [socket, roomId]);

  return state;
}
