import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IOrder } from './interfaces/order.interface';
import { Model } from 'mongoose';

import { CreateOrderDto } from './dto/create-order.dto';
import { UserService } from '../user/user.service';
import { CartService } from '../cart/cart.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<IOrder>,
    private readonly userService: UserService,
    private readonly cartService: CartService
  ) {}

  async create(
    createOrderDto: CreateOrderDto,
    idFromToken: string
  ): Promise<IOrder | BadRequestException | UnauthorizedException> {
    try {
      if (createOrderDto.customerId !== idFromToken) {
        return new UnauthorizedException();
      }

      const foundUser = await this.userService.findById(createOrderDto.customerId);

      if (foundUser) {
        const createdOrder = new this.orderModel(createOrderDto);

        if (createdOrder) {
          await createdOrder.save();
          await this.cartService.clearCart(idFromToken);

          return createdOrder;
        }
      }
    } catch (err) {
      return new BadRequestException(err);
    }
  }

  async getAllOrdersByUserId(idFromToken: string): Promise<IOrder[]> {
    return await this.orderModel.find({ customerId: idFromToken }).exec();
  }
}
