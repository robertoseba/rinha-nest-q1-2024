import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-store';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      // @ts-ignore;
      useFactory: (config: ConfigService) => ({
        store: async () =>
          await redisStore({
            socket: {
              host: config.get('REDIS_SERVER', 'localhost'),
              port: parseInt(config.get('REDIS_PORT', '6379')),
            },
          }),
      }),

      isGlobal: true,
    }),
  ],
})
export class CacheModule {}
