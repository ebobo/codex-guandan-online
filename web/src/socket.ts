import { io, Socket } from 'socket.io-client';

export function createSocket(url = '/ws'): Socket {
  return io(url);
}
