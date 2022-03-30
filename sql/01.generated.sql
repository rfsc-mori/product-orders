start transaction;

create table if not exists category (
    created_at datetime(6) default current_timestamp(6) not null,
    updated_at datetime(6) default current_timestamp(6) not null on update current_timestamp(6),
    id   varchar(32) not null primary key,
    name varchar(255) not null,
    unique (name)
);

create table if not exists product (
    created_at datetime(6) default current_timestamp(6) not null,
    updated_at datetime(6) default current_timestamp(6) not null on update current_timestamp(6),
    id                 varchar(32) not null primary key,
    title              varchar(255) not null,
    price              decimal(15, 4) null,
    available_quantity int not null,
    category_id        varchar(32) not null,
    foreign key (category_id) references category (id)
);

create table if not exists user (
    created_at datetime(6) default current_timestamp(6) not null,
    updated_at datetime(6) default current_timestamp(6) not null on update current_timestamp(6),
    id       int auto_increment primary key,
    name     varchar(260) not null,
    email    varchar(254) not null,
    password binary(60) not null,
    unique (email)
);

create table if not exists `order` (
    created_at datetime(6) default current_timestamp(6) not null,
    updated_at datetime(6) default current_timestamp(6) not null on update current_timestamp(6),
    id      int auto_increment primary key,
    user_id int not null,
    foreign key (user_id) references user (id)
);

create table if not exists product_orders (
    order_id   int not null,
    product_id varchar(32) not null,
    primary key (order_id, product_id),
    foreign key (order_id) references `order` (id)
        on update cascade on delete cascade,
    foreign key (product_id) references product (id),
    index (order_id),
    index (product_id)
);

commit;
