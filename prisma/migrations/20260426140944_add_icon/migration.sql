/*
  Warnings:

  - Added the required column `iconColor` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `iconKey` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `iconColor` VARCHAR(191) NOT NULL,
    ADD COLUMN `iconKey` VARCHAR(191) NOT NULL;
