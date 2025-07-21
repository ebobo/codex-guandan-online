import { z } from 'zod';

export const createRoomSchema = z.object({
  roomId: z.string(),
});
export type CreateRoomDto = z.infer<typeof createRoomSchema>;

export const joinRoomSchema = z.object({
  roomId: z.string(),
});
export type JoinRoomDto = z.infer<typeof joinRoomSchema>;

export const startGameSchema = z.object({
  roomId: z.string(),
  seed: z.union([z.string(), z.number()]),
});
export type StartGameDto = z.infer<typeof startGameSchema>;

export const playCardsSchema = z.object({
  roomId: z.string(),
  cards: z.array(z.string()),
});
export type PlayCardsDto = z.infer<typeof playCardsSchema>;

export const syncSchema = z.object({
  roomId: z.string(),
});
export type SyncDto = z.infer<typeof syncSchema>;

export const chatSchema = z.object({
  roomId: z.string(),
  text: z.string(),
});
export type ChatDto = z.infer<typeof chatSchema>;

export const listRoomsSchema = z.undefined();
export type ListRoomsDto = z.infer<typeof listRoomsSchema>;
