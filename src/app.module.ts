import { Module } from '@nestjs/common';
import { CustomLoggerModule } from './infra/custom-logger/custom-logger.module';
import { ConfigModule } from '@nestjs/config';
import { CustomerModule } from './app/customer/customer.module';

@Module({
  imports: [
    CustomLoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CustomerModule,
  ],
})
export class AppModule {}
