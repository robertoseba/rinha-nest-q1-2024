import { Module } from '@nestjs/common';
import { CustomLoggerModule } from '../infra/custom-logger/custom-logger.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './customer/customer.module';
import { DatabaseModule } from '../infra/db/database.module';

@Module({
  imports: [
    DatabaseModule,
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
  ],
})
export class AppModule {}
