import { Controller, Get, Param } from '@nestjs/common';
import { AccountValidationPipe } from '../common/pipes/account-validation.pipe';
import { getStatementService } from './service/get-statement.service';
import { TStatement } from './type/statement.type';

@Controller()
export class AccountController {
  constructor(private readonly service: getStatementService) {}

  @Get('/clientes/:id/extrato')
  async getStatement(
    @Param('id', AccountValidationPipe) id: number,
  ): Promise<TStatement> {
    return await this.service.execute(id);
  }
}
