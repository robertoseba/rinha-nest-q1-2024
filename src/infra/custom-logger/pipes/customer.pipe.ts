import { ParseIntPipe, UnprocessableEntityException } from '@nestjs/common';

export class CustomerValidationPipe extends ParseIntPipe {
  constructor() {
    super({
      exceptionFactory(error) {
        return new UnprocessableEntityException(
          'Cliente Inválido. Precisa ser um parametro numérico.',
        );
      },
    });
  }
}
