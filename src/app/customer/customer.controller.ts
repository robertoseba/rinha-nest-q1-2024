import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { TStatement } from './type/statement.type';
import {
  TInputTransaction,
  TOuputTransaction,
  inputTransactionSchema,
} from './type/transaction.type';
import { ZodValidationPipe } from '../../infra/pipes/zod-validation.pipe';
import { CustomerValidationPipe } from '../../infra/pipes/customer-validation.pipe';

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
  ): TOuputTransaction {
    return { limite: 1, saldo: 1 };
  }
}
