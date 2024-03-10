import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { AccountValidationPipe } from '../common/pipes/account-validation.pipe';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { AccountService } from './account.service';
import {
  TInputTransaction,
  TOuputTransaction,
  inputTransactionSchema,
} from './type/transaction.type';

@Controller()
export class TransactionController {
  constructor(private readonly service: AccountService) {}

  @Post('/clientes/:id/transacoes')
  @HttpCode(200)
  async createTransaction(
    @Param('id', AccountValidationPipe) id: number,
    @Body(new ZodValidationPipe(inputTransactionSchema))
    transaction: TInputTransaction,
  ): Promise<TOuputTransaction> {
    const account = await this.service.createTransaction(id, transaction);

    return { limite: account.limit, saldo: account.balance };
  }
}
