import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';

export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  async seed(dataSource: DataSource): Promise<void> {
    this.logger.log('Seeding Database');
    dataSource.synchronize(true);
    const runner = dataSource.createQueryRunner();
    const result = await runner.manager
      .query(`INSERT INTO customers (name) VALUES
		('o barato sai caro');
		`);
    this.logger.log(result.raw);
  }
}
