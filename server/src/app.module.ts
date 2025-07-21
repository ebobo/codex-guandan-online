import { Module } from '@nestjs/common';
import { GameGateway } from './gateway/game.gateway';
import { RoomService } from './room.service';
import { redisProvider } from './redis.provider';

@Module({
  providers: [GameGateway, RoomService, redisProvider],
})
export class AppModule {}
