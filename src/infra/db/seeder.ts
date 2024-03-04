import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Customer } from '../../app/customer/entity/customer.entity';

export class Seeder {
  private readonly logger = new Logger(Seeder.name);

  async seed(dataSource: DataSource): Promise<void> {
    this.logger.log('Seeding Database...');

    await dataSource.synchronize(true);

    const repo = dataSource.getRepository(Customer);

    await repo.save({ name: 'o barato sai caro', limit: 1000 * 100 });
    await repo.save({ name: 'zan corp ltda', limit: 800 * 100 });
    await repo.save({ name: 'les cruders', limit: 10000 * 100 });
    await repo.save({ name: 'padaria joia de cocaia', limit: 100000 * 100 });
    await repo.save({ name: 'kid mais', limit: 5000 * 100 });
  }
}
