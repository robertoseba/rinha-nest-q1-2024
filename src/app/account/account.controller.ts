import { Controller, Get, Param } from '@nestjs/common';
import { AccountValidationPipe } from '../common/pipes/account-validation.pipe';
import { AccountService } from './account.service';
import { TStatement } from './type/statement.type';

@Controller()
export class AccountController {
  constructor(private readonly service: AccountService) {}

  @Get('/clientes/:id/extrato')
  async getStatement(
    @Param('id', AccountValidationPipe) id: number,
  ): Promise<TStatement> {
    return await this.service.getStatement(id);
  }
}
