import { Controller, Get, Param } from '@nestjs/common';
import { AccountValidationPipe } from './account-validation.pipe';
import { GetStatementService } from './service/get-statement.service';
import { TStatement } from './type/statement.type';

@Controller()
export class AccountController {
  constructor(private readonly service: GetStatementService) {}

  @Get('/clientes/:id/extrato')
  async getStatement(
    @Param('id', AccountValidationPipe) id: number,
  ): Promise<TStatement> {
    return await this.service.execute(id);
  }
}
