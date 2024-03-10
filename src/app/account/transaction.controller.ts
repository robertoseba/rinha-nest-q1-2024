import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AccountValidationPipe } from '../common/pipes/account-validation.pipe';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import {
  TInputTransaction,
  TOuputTransaction,
  inputTransactionSchema,
} from './type/transaction.type';
import { CreateTransactionService } from './usecase/create-transaction.service';

@Controller()
export class TransactionController {
  constructor(private readonly service: CreateTransactionService) {}

  @Post('/clientes/:id/transacoes')
  @HttpCode(200)
  async createTransaction(
    @Param('id', AccountValidationPipe) id: number,
    @Body(new ZodValidationPipe(inputTransactionSchema))
    transaction: TInputTransaction,
  ): Promise<TOuputTransaction> {
    const account = await this.service.execute(id, transaction);

    return { limite: account.limit, saldo: account.balance };
  }
}
