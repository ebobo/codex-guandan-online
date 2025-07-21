import { useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

export interface RoomInfo {
  roomId: string;
  players: number;
}

export function useRoomList(socket: Socket | null) {
  const [rooms, setRooms] = useState<RoomInfo[]>([]);

  useEffect(() => {
    if (!socket) return;
    const onRooms = (list: RoomInfo[]) => setRooms(list);
    socket.on('rooms', onRooms);
    socket.emit('listRooms');
    return () => {
      socket.off('rooms', onRooms);
    };
  }, [socket]);

  return rooms;
}

export function useConnection(socket: Socket | null) {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!socket) return;
    const update = () => setConnected(socket.connected);
    socket.on('connect', update);
    socket.on('disconnect', update);
    update();
    return () => {
      socket.off('connect', update);
      socket.off('disconnect', update);
    };
  }, [socket]);

  return connected;
}

