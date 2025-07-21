import React, { useState, FormEvent } from 'react';

interface Props {
  onJoin(roomId: string): void;
}

export function Lobby({ onJoin }: Props) {
  const [roomId, setRoomId] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (roomId) onJoin(roomId);
  }

  return (
    <form className="lobby" onSubmit={submit}>
      <h1>Guandan Lobby</h1>
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
