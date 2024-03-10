import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomLoggerModule } from '../infra/custom-logger/custom-logger.module';
import { DatabaseModule } from '../infra/db/database.module';
import { AccountModule } from './account/account.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AccountModule,
  ],
})
export class AppModule {}
