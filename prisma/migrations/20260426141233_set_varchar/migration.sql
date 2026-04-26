/*
  Warnings:

  - You are about to alter the column `iconColor` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `iconKey` on the `category` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `category` MODIFY `iconColor` VARCHAR(30) NOT NULL,
    MODIFY `iconKey` VARCHAR(100) NOT NULL;
