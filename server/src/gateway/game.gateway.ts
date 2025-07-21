import {
  WebSocketGateway,
  OnGatewayConnection,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  createRoomSchema,
  joinRoomSchema,
  startGameSchema,
  playCardsSchema,
  syncSchema,
  chatSchema,
  CreateRoomDto,
  JoinRoomDto,
  StartGameDto,
  PlayCardsDto,
  SyncDto,
  ChatDto,
} from '../dto/events';
import { RoomService } from '../room.service';
import { Server, Socket } from 'socket.io';
import { z } from 'zod';
import { SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';

@WebSocketGateway({ namespace: '/ws' })
export class GameGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private rooms: RoomService) {}

  handleConnection() {
    // connection established
  }

  private parse<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
  }

  @SubscribeMessage('createRoom')
  async createRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateRoomDto,
  ) {
    const dto = this.parse(createRoomSchema, payload);
    await this.rooms.createRoom(dto.roomId);
    client.join(dto.roomId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: JoinRoomDto,
  ) {
    const dto = this.parse(joinRoomSchema, payload);
    client.join(dto.roomId);
    await this.rooms.joinRoom(dto.roomId, client.id);
    const count = await this.rooms.getPlayerCount(dto.roomId);
    let state = await this.rooms.getState(dto.roomId);
    if (!state && count === 3) {
      state = await this.rooms.startGame(dto.roomId, Date.now());
      this.server.to(dto.roomId).emit('state', state);
      return;
    }
    if (state) {
      client.emit('state', state);
    }
  }

  @SubscribeMessage('startGame')
  async startGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: StartGameDto,
  ) {
    const dto = this.parse(startGameSchema, payload);
    const state = await this.rooms.startGame(dto.roomId, dto.seed);
    this.server.to(dto.roomId).emit('state', state);
  }

  @SubscribeMessage('playCards')
  async playCards(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: PlayCardsDto,
  ) {
    const dto = this.parse(playCardsSchema, payload);
    const state = await this.rooms.playCards(dto.roomId, { cards: dto.cards });
    this.server.to(dto.roomId).emit('state', state);
  }

  @SubscribeMessage('sync')
  async sync(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: SyncDto,
  ) {
    const dto = this.parse(syncSchema, payload);
    const state = await this.rooms.getState(dto.roomId);
    if (state) {
      client.emit('state', state);
    }
  }

  @SubscribeMessage('chat')
  async chat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatDto,
  ) {
    const dto = this.parse(chatSchema, payload);
    this.server.to(dto.roomId).emit('chat', { player: client.id, text: dto.text });
  }
}
