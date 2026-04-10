-- CreateTable
CREATE TABLE `user` (
    `id` CHAR(26) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `timezone` VARCHAR(50) NOT NULL DEFAULT 'Asia/Seoul',
    `currency` CHAR(3) NOT NULL DEFAULT 'KRW',
    `birth_date` DATE NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deleted_at` DATETIME(0) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refresh_token` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `token` CHAR(64) NOT NULL,
    `user_id` CHAR(26) NOT NULL,
    `device_id` CHAR(36) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `expires_at` DATETIME(0) NOT NULL,
    `revoked_at` DATETIME(0) NULL,

    INDEX `refresh_token_user_id_idx`(`user_id`),
    UNIQUE INDEX `refresh_token_user_id_device_id_key`(`user_id`, `device_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_auth` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` CHAR(26) NOT NULL,
    `provider` VARCHAR(10) NOT NULL,
    `provider_id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `user_auth_user_id_idx`(`user_id`),
    UNIQUE INDEX `user_auth_provider_id_provider_key`(`provider_id`, `provider`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `account` (
    `id` CHAR(26) NOT NULL,
    `group_type` TINYINT UNSIGNED NOT NULL,
    `user_id` CHAR(26) NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `balance` BIGINT NOT NULL DEFAULT 0,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `account_user_id_group_type_currency_key`(`user_id`, `group_type`, `currency`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transaction` (
    `id` CHAR(26) NOT NULL,
    `user_id` CHAR(26) NOT NULL,
    `type` TINYINT UNSIGNED NOT NULL,
    `category_id` CHAR(26) NULL,
    `from_account_id` CHAR(26) NULL,
    `to_account_id` CHAR(26) NULL,
    `amount` BIGINT NOT NULL,
    `currency` CHAR(3) NOT NULL,
    `transaction_date` DATE NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    INDEX `transaction_user_id_transaction_date_idx`(`user_id`, `transaction_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `category` (
    `id` CHAR(26) NOT NULL,
    `user_id` CHAR(26) NOT NULL,
    `group_type` TINYINT UNSIGNED NOT NULL,
    `name` VARCHAR(50) NOT NULL,

    UNIQUE INDEX `category_user_id_name_group_type_key`(`user_id`, `name`, `group_type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `refresh_token` ADD CONSTRAINT `refresh_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_auth` ADD CONSTRAINT `user_auth_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `account` ADD CONSTRAINT `account_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_from_account_id_fkey` FOREIGN KEY (`from_account_id`) REFERENCES `account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transaction` ADD CONSTRAINT `transaction_to_account_id_fkey` FOREIGN KEY (`to_account_id`) REFERENCES `account`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `category` ADD CONSTRAINT `category_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
