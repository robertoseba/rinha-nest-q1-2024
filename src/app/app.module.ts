import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from '../infra/custom-logger/custom-logger.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
  ],
})
export class AppModule {}
