/*
  Warnings:

  - You are about to drop the column `to_account_id` on the `transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_from_account_id_fkey`;

-- DropForeignKey
ALTER TABLE `transaction` DROP FOREIGN KEY `transaction_to_account_id_fkey`;

-- DropIndex
DROP INDEX `transaction_from_account_id_fkey` ON `transaction`;

-- DropIndex
DROP INDEX `transaction_to_account_id_fkey` ON `transaction`;

-- AlterTable
ALTER TABLE `transaction` DROP COLUMN `to_account_id`;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_from_account_id_fkey` FOREIGN KEY (`from_account_id`) REFERENCES `account`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
