import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';

const CACHE_EXPIRATION_MS = 0;

export function CheckCache(): MethodDecorator {
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

      const is404 = await cacheManager.get(`${accountId}_not_found`);

      if (is404) {
        throw new NotFoundException('Cliente não encontrado!');
      }
      try {
        return await method.apply(this, args);
      } catch (err) {
        if (err instanceof NotFoundException) {
          await cacheManager.set(
            `${accountId}_not_found`,
            1,
            CACHE_EXPIRATION_MS,
          );
        }
        throw err;
      }
    };
  };
}
