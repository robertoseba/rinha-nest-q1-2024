import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../infra/cache/cache.module';
import { CustomLoggerModule } from '../infra/custom-logger/custom-logger.module';
import { AccountModule } from './account/account.module';
@Module({
  imports: [
    CacheModule,
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
  ],
})
export class AppModule {}
