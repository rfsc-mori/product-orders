import { Module } from '@nestjs/common';
import { CommandModule } from "nestjs-command";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./api/user/users.module";
import { CategoriesModule } from "./api/category/categories.module";
import { ProductsModule } from "./api/product/products.module";
import { OrdersModule } from "./api/order/orders.module";
import { UsersController } from "./api/user/users.controller";
import { CategoriesController } from "./api/category/categories.controller";
import { ProductsController } from "./api/product/products.controller";
import { OrdersController } from "./api/order/orders.controller";
import { UsersService } from "./api/user/users.service";
import { CategoriesService } from "./api/category/categories.service";
import { ProductsService } from "./api/product/products.service";
import { OrdersService } from "./api/order/orders.service";
import { AppCommand } from "./app.command";

import configuration from "./config/configuration";
import { getConnectionOptions } from "typeorm";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [
        configuration,
      ]
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        })
    }),
    UsersModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    CommandModule,
  ],
  controllers: [AppController, UsersController, CategoriesController, ProductsController, OrdersController],
  providers: [AppService, UsersService, CategoriesService, ProductsService, OrdersService, AppCommand],
})
export class AppModule {}
