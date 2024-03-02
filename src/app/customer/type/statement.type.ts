import { TTransaction } from './transaction.type';

export type TStatement = {
  saldo: {
    total: number;
    data_extrato: Date;
    limite: number;
  };
  ultimas_transacoes: TTransaction[];
};
