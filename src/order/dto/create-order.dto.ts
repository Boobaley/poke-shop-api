import { IsString, ArrayNotEmpty, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IOrderItem } from '../interfaces/order-list-item.interface';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  readonly customerId: string;

  @ApiProperty()
  @IsNumber()
  readonly totalPrice: number;

  @ApiProperty({ type: [CreateOrderItemDto] })
  @IsArray()
  @ArrayNotEmpty()
  readonly itemsList: Array<IOrderItem>;
}
