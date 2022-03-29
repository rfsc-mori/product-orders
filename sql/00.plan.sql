START TRANSACTION;

CREATE TABLE IF NOT EXISTS `user` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'The user id.',
    `name` VARCHAR(260) NOT NULL COMMENT 'The user\'s full name.', -- 60 for name, 200 for family/last name
    `email` VARCHAR(254) NOT NULL COMMENT 'The user\'s email.',  -- 254 according to https://www.rfc-editor.org/errata_search.php?rfc=3696&eid=1690
    `password` BINARY(60) NOT NULL COMMENT 'The user\'s encrypted password.', -- assumed max bcrypt output
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE (`email`)
)
COMMENT 'Stores the users\' details.';

CREATE TABLE IF NOT EXISTS `category` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'The category id.',
    `name` VARCHAR(255) NOT NULL COMMENT 'The category name.',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    UNIQUE (`name`)
)
COMMENT 'The categories\' details.';

CREATE TABLE IF NOT EXISTS `order` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'The order id.',
    `user_id` INT NOT NULL COMMENT 'The id of the user who created the order.', -- FK:user.id
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `order_user_id`
        FOREIGN KEY (`user_id`)
        REFERENCES `user` (`id`)
)
COMMENT 'Stores the orders created by users.';

CREATE TABLE IF NOT EXISTS `product` (
    `id` INT NOT NULL AUTO_INCREMENT COMMENT 'The product id.',
    `category_id` INT NOT NULL COMMENT 'The category id.', -- FK:category.id
    `title` VARCHAR(255) NOT NULL COMMENT 'The product title.',
    `price` DECIMAL(10,4) NOT NULL COMMENT 'The product\'s price in BRL.', -- Assuming BRL-only for less complexity
    `available_quantity` INT NOT NULL COMMENT 'The number of units available.',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `product_category_id`
        FOREIGN KEY (`category_id`)
        REFERENCES `category` (`id`)
)
COMMENT 'Stores the products\' details.';

CREATE TABLE IF NOT EXISTS `product_orders` (
    `order_id` INT NOT NULL COMMENT 'The order id.', -- FK:order.id
    `product_id` INT NOT NULL COMMENT 'The product id.', -- FK:product.id
    -- `quantity` INT NOT NULL COMMENT 'Number of products requested.', -- not specified as requirement
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `product_orders_order_id`
        FOREIGN KEY (`order_id`)
        REFERENCES `order` (`id`)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT `product_orders_product_id`
        FOREIGN KEY (`product_id`)
        REFERENCES `product` (`id`)
)
COMMENT 'Stores the orders\' products.';

COMMIT;
