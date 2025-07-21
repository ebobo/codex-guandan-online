import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS } from './redis.provider';
import type { GameState } from '@engine/stateMachine';
import { initGame, play as applyMove } from '@engine/stateMachine';

@Injectable()
export class RoomService {
  constructor(@Inject(REDIS) private redis: Redis) {}

  async createRoom(roomId: string): Promise<void> {
    await this.redis.set(this.key(roomId), JSON.stringify({}), 'EX', 60 * 60 * 24);
    await this.redis.sadd(this.roomsKey(), roomId);
    await this.redis.expire(this.roomsKey(), 60 * 60 * 24);
  }

  async joinRoom(roomId: string, player: string): Promise<void> {
    await this.redis.sadd(this.playersKey(roomId), player);
    await this.redis.expire(this.playersKey(roomId), 60 * 60 * 24);
  }

  async getPlayerCount(roomId: string): Promise<number> {
    return this.redis.scard(this.playersKey(roomId));
  }

  async listRooms(): Promise<{ roomId: string; players: number }[]> {
    const ids = await this.redis.smembers(this.roomsKey());
    const rooms = await Promise.all(
      ids.map(async (id) => ({ roomId: id, players: await this.getPlayerCount(id) }))
    );
    return rooms;
  }

  async startGame(roomId: string, seed: number | string): Promise<GameState> {
    const state = initGame(seed);
    await this.redis.set(this.key(roomId), JSON.stringify(state), 'EX', 60 * 60 * 24);
    return state;
  }

  async playCards(roomId: string, move: { cards: string[] }): Promise<GameState> {
    const state = await this.getState(roomId);
    if (!state) throw new Error('No game');
    const next = applyMove(state, { cards: move.cards });
    await this.redis.set(this.key(roomId), JSON.stringify(next), 'EX', 60 * 60 * 24);
    return next;
  }

  async getState(roomId: string): Promise<GameState | null> {
    const data = await this.redis.get(this.key(roomId));
    return data ? (JSON.parse(data) as GameState) : null;
  }

  key(roomId: string): string {
    return `room:${roomId}:state`;
  }

  playersKey(roomId: string): string {
    return `room:${roomId}:players`;
  }

  roomsKey(): string {
    return 'rooms';
  }
}
