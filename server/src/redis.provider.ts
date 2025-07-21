import { Provider } from '@nestjs/common';
import Redis from 'ioredis';

export const REDIS = 'REDIS';

export const redisProvider: Provider = {
  provide: REDIS,
  useFactory: () => {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    return new Redis(url);
  },
};
