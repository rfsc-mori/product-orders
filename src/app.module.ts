import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./api/user/users.module";
import { CategoriesModule } from "./api/category/categories.module";
import { ProductsModule } from "./api/product/products.module";
import { OrdersModule } from "./api/order/orders.module";

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
