import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../app/customer/entity/customer.entity';
import { Balance } from '../../app/customer/entity/balance.entity';
import { Transaction } from '../../app/customer/entity/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOSTNAME'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Customer, Balance, Transaction],
        synchronize: false,
        poolSize: configService.get('DB_POOL_SIZE'),
        logging: false,
      }),
    }),
  ],
})
export class DatabaseModule {}
