import { Body, Controller, Get, Param, Post, Response, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { OrdersService } from "./orders.service";
import { JwtAuthGuard } from "../../auth/jwt-auth.guard";
import { CreateOrderDto } from "./dto";
import { JwtUserData } from "../../auth/decorators/jwt.decorator";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@JwtUserData() userData, @Body() orderDto: CreateOrderDto, @Response() res) {
    const order = await this.ordersService.create(userData.id, orderDto);

    return res
      .header('Location', order.id.toString())
      .json(order);
  }

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async order(@JwtUserData() userData, @Param('id') id: number) {
    return this.ordersService.findProductOrdersViewById(userData.id, id);
  }
}
