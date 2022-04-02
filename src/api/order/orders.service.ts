import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderEntity } from "./order.entity";
import { CreateOrderDto } from "./dto";
import { UsersService } from "../user/users.service";
import { ProductsService } from "../product/products.service";
import { validate } from "class-validator";
import { OrderView, ProductOrdersView } from "./order.interface";

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  async findProductOrdersViewById(userId: number, id: number) {
    const order = await this.getOrderEntityById(userId, id, ['user', 'products']);
    return OrdersService.buildProductOrdersView(order);
  }

  async create(userId: number, orderDto: CreateOrderDto) {
    await this.usersService.ensureUserExistsById(userId);
    await this.productsService.ensureProductsExistsById(orderDto.productIds);

    // Ignore duplicated products within the same order
    const uniqueProducts = [...new Set(orderDto.productIds)];

    if (uniqueProducts.length == 0) {
      const errors = {productIds: 'At least one product id must be specified.'};
      throw new HttpException({message: 'Input data validation failed.', errors}, HttpStatus.BAD_REQUEST);
    }

    let order = new OrderEntity();
    order.userId = userId;

    // Workaround:
    // Provide only the id for the relation as @RelationId won't update the bridge table.
    // Avoids the need for loading the whole entity through a join.
    order.products = uniqueProducts.map(id => ({ id } as any));

    await OrdersService.validateOrder(order);

    for (const product of uniqueProducts) {
      await this.productsService.consumeProduct(product);
    }

    const orderEntity = await this.ordersRepository.save(order);
    return OrdersService.buildOrderView(orderEntity);
  }

  static buildOrderView(order: OrderEntity): OrderView {
    return {
      id: order.id,
      userId: order.userId,
      productIds: order.productIds,
    };
  }

  static buildProductOrdersView(order: OrderEntity): ProductOrdersView {
    return {
      id: order.id,
      user: UsersService.buildShortUserView(order.user),
      products: order.products.map(ProductsService.buildShortProductView),
    };
  }

  private async getOrderEntityById(userId: number, id: number, relations?: string[]) {
    await this.usersService.ensureUserExistsById(userId);

    const order = await this.ordersRepository.findOne({
      where: { id: id, userId: userId },
      relations: relations
    });

    if (!order) {
      const errors = {id: 'The specified order does not exist.'};
      throw new HttpException({message: 'Resource not found.', errors}, HttpStatus.NOT_FOUND);
    }

    return order;
  }

  private static async validateOrder(order: OrderEntity) {
    const errors = await validate(order);

    if (errors.length > 0) {
      throw new HttpException({message: 'Input data validation failed.', errors: errors}, HttpStatus.BAD_REQUEST);
    }
  }
}
