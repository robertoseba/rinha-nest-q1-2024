import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { TStatement } from '../type/statement.type';

const CACHE_EXPIRATION_MS = 0;

/**
  Caches the statement for a given account ID.
 */
export function StatementCache(): MethodDecorator {
  const injector = Inject(CACHE_MANAGER);

  return function decorator(
    target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ): void {
    injector(target, 'cacheManager');

    const method = descriptor.value;

    descriptor.value = async function wrapper(...args: any[]) {
      const accountId = args[0];

      const cacheManager: Cache = this.cacheManager;

      const cachedStatement: TStatement | undefined = await cacheManager.get(
        `${accountId}_statement`,
      );

      if (cachedStatement) {
        return cachedStatement;
      }

      const statement = await method.apply(this, args);

      await cacheManager.set(
        `${accountId}_statement`,
        statement,
        CACHE_EXPIRATION_MS,
      );

      return statement;
    };
  };
}
