import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from '../../app/customer/entity/customer.entity';
import { Balance } from '../../app/customer/entity/balance.entity';
import { Transaction } from '../../app/customer/entity/transaction.entity';
import { DataSource } from 'typeorm';
import { Seeder } from './seeder';

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
        poolSize: configService.get('DB_POOL_SIZE'),
        logging: false,
      }),
    }),
  ],
  providers: [Seeder],
})
export class DatabaseModule {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    private dataSource: DataSource,
    private seeder: Seeder,
  ) {}
  async onModuleInit(): Promise<void> {
    await this.seeder.seed(this.dataSource);
  }
}
