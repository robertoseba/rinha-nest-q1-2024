import { z } from 'zod';

const transactionType = ['c', 'd'] as const;

const transactionSchema = z
  .object({
    valor: z.number().positive(),
    tipo: z.enum(transactionType),
    descricao: z.string(),
    realizada_em: z.date(),
  })
  .required();

export type TTransaction = z.infer<typeof transactionSchema>;

export const inputTransactionSchema = transactionSchema.omit({
  realizada_em: true,
});

export type TInputTransaction = z.infer<typeof inputTransactionSchema>;

export type TTransactionReturn = {
  limite: number;
  saldo: number;
};
