import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrdersService } from "./orders.service";
import { OrdersController } from "./orders.controller";
import { OrderEntity } from "./order.entity";
import { UsersModule } from "../user/users.module";
import { ProductsModule } from "../product/products.module";

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    TypeOrmModule.forFeature([OrderEntity])
  ],
  exports: [TypeOrmModule, OrdersService],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
