import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { io, Socket } from 'socket.io-client';
import RedisMock from 'ioredis-mock';
import { REDIS } from '../src/redis.provider';
import type { GameState } from '@engine/stateMachine';

describe('GameGateway (e2e)', () => {
  let app: INestApplication;
  let url: string;
  const clients: Socket[] = [];

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(REDIS)
      .useValue(new RedisMock())
      .compile();

    app = moduleRef.createNestApplication();
    await app.listen(0);
    const server = app.getHttpServer();
    const address = server.address();
    const port = typeof address === 'string' ? 0 : address.port;
    url = `http://localhost:${port}/ws`;
  });

  afterAll(async () => {
    clients.forEach((c) => c.close());
    await app.close();
  });

  function createClient() {
    const c = io(url);
    clients.push(c);
    return c;
  }

  it('plays happy path', async () => {
    const c1 = createClient();
    const c2 = createClient();
    const c3 = createClient();

    await new Promise<void>((resolve) => c1.on('connect', () => resolve()));
    await new Promise<void>((resolve) => c2.on('connect', () => resolve()));
    await new Promise<void>((resolve) => c3.on('connect', () => resolve()));

    c1.emit('createRoom', { roomId: 'r1' });
    c1.emit('joinRoom', { roomId: 'r1' });
    c2.emit('joinRoom', { roomId: 'r1' });
    c3.emit('joinRoom', { roomId: 'r1' });
    c1.emit('startGame', { roomId: 'r1', seed: 1 });

    const states: GameState[] = [];
    await new Promise<void>((resolve) => {
      c1.on('state', (s) => {
        states.push(s);
        if (states.length >= 1) resolve();
      });
    });

    expect(states[0]).toBeDefined();

    c1.emit('playCards', { roomId: 'r1', cards: [] });
    const after: GameState[] = [];
    await new Promise<void>((resolve) => {
      c2.on('state', (s) => {
        after.push(s);
        if (after.length >= 1) resolve();
      });
    });
    expect(after[0].turn).toBe(1);
  });
});
