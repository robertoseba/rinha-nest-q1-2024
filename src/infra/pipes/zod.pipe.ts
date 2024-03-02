import {
  PipeTransform,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';
import { ZodError, ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValue = this.schema.parse(value);
      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UnprocessableEntityException(
          error.errors.map((error) => ({ [error.path.join()]: error.message })),
          'INVALID_INPUT',
        );
      }

      throw new UnprocessableEntityException(error.errors);
    }
  }
}
