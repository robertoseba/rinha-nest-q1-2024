import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const dbDatasource: DataSourceOptions = {
  type: 'postgres',
  host: process.env['DB_HOSTNAME'],
  port: parseInt(process.env['DB_PORT'] ?? '5432'),
  username: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_NAME'],
  entities: ['dist/**/*.entity.js'],
  poolSize: parseInt(process.env['DB_POOL_SIZE'] ?? '10'),
  logging: true,
  synchronize: false,
  migrations: ['dist/infra/db/migrations/*.js'],
  migrationsTableName: 'typeorm_migrations',
  migrationsRun: true,
};

const dataSource = new DataSource(dbDatasource);
export default dataSource;
