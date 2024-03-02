import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TStatement } from './type/statement.type';
import {
  TInputTransaction,
  TTransactionReturn,
  inputTransactionSchema,
} from './type/transaction.type';
import { ZodValidationPipe } from '../../infra/custom-logger/pipes/zod.pipe';
import { CustomerValidationPipe } from '../../infra/custom-logger/pipes/customer.pipe';

@Controller()
export class CustomerController {
  constructor(private readonly service: CustomerService) {}

  @Get('/clientes/:id/extrato')
  getStatement(@Param('id', CustomerValidationPipe) id: number): TStatement {
    return this.service.getStatement(id);
  }

  @Post('/clientes/:id/transacoes')
  createTransaction(
    @Param('id', CustomerValidationPipe) id: number,
    @Body(new ZodValidationPipe(inputTransactionSchema))
    transaction: TInputTransaction,
  ): TTransactionReturn {
    return { limite: 1, saldo: 1 };
  }
}
