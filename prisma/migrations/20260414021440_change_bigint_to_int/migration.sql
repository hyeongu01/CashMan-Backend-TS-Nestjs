/*
  Warnings:

  - You are about to alter the column `balance` on the `account` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `amount` on the `transaction` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- AlterTable
ALTER TABLE `account` MODIFY `balance` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `transaction` MODIFY `amount` INTEGER NOT NULL;
