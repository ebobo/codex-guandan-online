import React, { useState, FormEvent } from 'react';
import type { Socket } from 'socket.io-client';
import { useRoomList, useConnection } from '../hooks/useRoomList';

interface Props {
  onJoin(roomId: string): void;
  socket: Socket | null;
}

export function Lobby({ onJoin, socket }: Props) {
  const [roomId, setRoomId] = useState('');
  const rooms = useRoomList(socket);
  const connected = useConnection(socket);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (roomId) onJoin(roomId);
  }

  return (
    <form className="lobby" onSubmit={submit}>
      <h1>Guandan Lobby</h1>
      <div className="status">{connected ? 'Connected' : 'Disconnected'}</div>
      <ul className="room-list">
        {rooms.map((r) => (
          <li key={r.roomId}>
            {r.roomId} ({r.players}){' '}
            <button type="button" onClick={() => onJoin(r.roomId)}>
              Join
            </button>
          </li>
        ))}
      </ul>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Room ID"
      />
      <button type="submit">Create / Join</button>
      <div className="slots">
        {[1, 2, 3].map((n) => (
          <div key={n} className="slot">
            Slot {n}
          </div>
        ))}
      </div>
    </form>
  );
}
