import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
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
  async getStatement(
    @Param('id', CustomerValidationPipe) id: number,
  ): Promise<TStatement> {
    const statement = await this.service.getStatement(id);

    if (!statement) {
      throw new NotFoundException('Cliente não encontrado!');
    }

    return statement;
  }

  @Post('/clientes/:id/transacoes')
  async createTransaction(
    @Param('id', CustomerValidationPipe) id: number,
    @Body(new ZodValidationPipe(inputTransactionSchema))
    transaction: TInputTransaction,
  ): Promise<TOuputTransaction> {
    return { limite: 1, saldo: 1 };
  }
}
