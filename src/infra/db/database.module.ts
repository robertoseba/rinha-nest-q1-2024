import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dbDatasource } from './data.source';
import { DatabaseService } from './database.service';

@Module({
  imports: [TypeOrmModule.forRoot(dbDatasource)],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
