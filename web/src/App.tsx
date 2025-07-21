import React, { useState } from 'react';
import { Lobby } from './components/Lobby';
import { Game } from './components/Game';
import { createSocket } from './socket';
import type { Socket } from 'socket.io-client';

export function App() {
  const [room, setRoom] = useState<string | null>(null);
  const [socket] = useState<Socket>(() => createSocket());

  function join(id: string) {
    socket.emit('createRoom', { roomId: id });
    socket.emit('joinRoom', { roomId: id });
    setRoom(id);
  }

  if (!room) return <Lobby onJoin={join} socket={socket} />;
  return <Game socket={socket} roomId={room} />;
}
