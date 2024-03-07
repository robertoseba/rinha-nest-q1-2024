import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get('NODE_ENV') === 'production' ? 'error' : 'debug',
          formatters: {
            level(level: string) {
              return { level };
            },
          },
          transport:
            config.get('LOG_PRETTY') === 'true' &&
            config.get('NODE_ENV') !== 'production'
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    levelFirst: true,
                    ignore: 'pid,req',
                  },
                }
              : undefined,
        },
      }),
    }),
  ],
})
export class CustomLoggerModule {}
