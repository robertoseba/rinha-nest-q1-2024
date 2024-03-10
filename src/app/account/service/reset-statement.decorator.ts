import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

/**
  Resets statement cache for a given account ID.
 */
export function ResetStatementCache(): MethodDecorator {
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

      const response = await method.apply(this, args);

      await cacheManager.del(`${accountId}_statement`);

      return response;
    };
  };
}
