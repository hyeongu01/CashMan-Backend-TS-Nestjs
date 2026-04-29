import { Prisma, transaction } from '@generated/prisma/client';

type TransactionRelation = keyof NonNullable<Prisma.transactionInclude>;

export type Transaction<
  T extends TransactionRelation[] | undefined = undefined,
> = T extends TransactionRelation[]
  ? Prisma.transactionGetPayload<{
      include: {
        [K in T[number]]: true;
      };
    }>
  : transaction;

/**
 * 거래 타입
 * - 0: 지출
 * - 1: 수입
 */
export type TransactionType = 0 | 1;
