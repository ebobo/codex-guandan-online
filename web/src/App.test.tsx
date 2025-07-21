import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EventEmitter } from 'events';
import { App } from './App';

class MockSocket extends EventEmitter {
  emit(event: string, payload?: unknown) {
    return super.emit(event, payload);
  }
}

vi.mock('./socket', () => ({
  createSocket: () => new MockSocket(),
}));

describe('App', () => {
  it('renders lobby heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Guandan Lobby'
    );
  });
});
