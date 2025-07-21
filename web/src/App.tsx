import React, { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Game } from './components/Game';
import { createSocket } from './socket';
import type { Socket } from 'socket.io-client';

export function App() {
  const [room, setRoom] = useState<string | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  function join(id: string) {
    const s = createSocket();
    s.emit('createRoom', { roomId: id });
    s.emit('joinRoom', { roomId: id });
    setSocket(s);
    setRoom(id);
  }

  if (!room) return <Lobby onJoin={join} />;
  return <Game socket={socket} roomId={room} />;
}
