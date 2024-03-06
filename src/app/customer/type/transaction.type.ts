import { z } from 'zod';
import { TransactionTypeEnum } from '../entity/transaction.entity';

const transactionSchema = z
  .object({
    valor: z.number().positive(),
    tipo: z.enum([TransactionTypeEnum.CREDIT, TransactionTypeEnum.DEBIT]),
    descricao: z.string().max(10),
    realizada_em: z.date(),
  })
  .required();

export type TTransaction = z.infer<typeof transactionSchema>;

export const inputTransactionSchema = transactionSchema.omit({
  realizada_em: true,
});

export type TInputTransaction = z.infer<typeof inputTransactionSchema>;

export type TOuputTransaction = {
  limite: number;
  saldo: number;
};
