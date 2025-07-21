import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';
import { useRoomList, useConnection } from './useRoomList';
import type { Socket } from 'socket.io-client';

class MockSocket extends EventEmitter {
  connected = false;
  emit(event: string, payload?: unknown) {
    return super.emit(event, payload);
  }
}

describe('useRoomList', () => {
  it('updates when rooms event received', () => {
    const socket = new MockSocket();
    const { result } = renderHook(() =>
      useRoomList(socket as unknown as Socket)
    );
    act(() => {
      socket.emit('rooms', [{ roomId: 'x', players: 1 }]);
    });
    expect(result.current[0].roomId).toBe('x');
  });

  it('tracks connection status', () => {
    const socket = new MockSocket();
    const { result } = renderHook(() =>
      useConnection(socket as unknown as Socket)
    );
    act(() => {
      socket.connected = true;
      socket.emit('connect');
    });
    expect(result.current).toBe(true);
    act(() => {
      socket.connected = false;
      socket.emit('disconnect');
    });
    expect(result.current).toBe(false);
  });
});

