import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { bufferLogs: true },
  );

  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);

  const port = configService.get<number>('PORT', 3000);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
