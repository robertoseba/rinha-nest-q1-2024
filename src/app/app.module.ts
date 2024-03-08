import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '../infra/custom-logger/custom-logger.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from '../infra/db/database.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    DatabaseModule,
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
  ],
})
export class AppModule {}
