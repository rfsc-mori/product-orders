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
import { AppCommand } from "./app.command";
import { AuthModule } from './auth/auth.module';

import { getConnectionOptions } from "typeorm";

import configuration from "./config/configuration";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppCommand],
})
export class AppModule {}
