import { Logger, Module } from '@nestjs/common';
import { REDIS } from './redis.constant';
import Redis from 'ioredis';

@Module({
  providers: [
    {
      provide: REDIS,
      useFactory: async () => {
        const logger = new Logger('Redis');

        const client = new Redis(process.env.REDIS_URL);

        client.on('connect', () => {
          logger.log('Connected to Redis');
        });

        client.on('error', (err) => {
          logger.error(err.message);
        });

        return client;
      },
    },
  ],
  exports: [REDIS],
})
export class RedisModule {}
