import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useGameState } from './useGameState';
import { EventEmitter } from 'events';
import type { Socket } from 'socket.io-client';
import type { GameState } from '@engine/stateMachine';

class MockSocket extends EventEmitter {
  emit(event: string, payload?: unknown) {
    super.emit(`${event}:called`, payload);
    return super.emit(event, payload);
  }
  on(event: string, listener: (...args: unknown[]) => void) {
    super.on(event, listener);
    return this;
  }
  off(event: string, listener: (...args: unknown[]) => void) {
    super.off(event, listener);
    return this;
  }
}

describe('useGameState', () => {
  it('updates when state event received', () => {
    const socket = new MockSocket();
    const { result } = renderHook(() => useGameState(socket as unknown as Socket, 'r1'));
    const state: GameState = {
      hands: [[], [], []],
      bottom: [],
      turn: 1,
      payouts: [0, 0, 0],
      finished: false,
    };
    act(() => {
      socket.emit('state', state);
    });
    expect(result.current?.turn).toBe(1);
  });
});
