import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbDatasource } from './data.source';

@Module({
  imports: [TypeOrmModule.forRoot(dbDatasource)],
})
export class DatabaseModule {}
