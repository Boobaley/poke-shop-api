import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import * as moment from 'moment';

import { OrderService } from './order.service';
import { IOrder } from './interfaces/order.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthUser } from '../helpers/decorators/auth-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('/')
  createOrder(@Body() body: CreateOrderDto, @AuthUser() tokenData): Promise<any> {
    const timestamp: string = moment().toISOString();
    const { _id } = tokenData;

    const payload = {
      ...body,
      createdAt: timestamp,
    };

    return this.orderService.create(payload, _id);
  }

  @Get('/')
  getAllUserOrders(@AuthUser() tokenData): Promise<IOrder[]> {
    return this.orderService.getAllOrdersByUserId(tokenData._id);
  }
}
