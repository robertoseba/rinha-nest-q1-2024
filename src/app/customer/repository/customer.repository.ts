import { TStatement } from '../type/statement.type';

export const CUSTOMER_REPOSITORY = Symbol('ICustomerRepository');

export interface ICustomerRepository {
  getStatement(id: number): Promise<TStatement>;
}
