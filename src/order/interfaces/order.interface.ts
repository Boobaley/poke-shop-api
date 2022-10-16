import { Document } from 'mongoose';

import { IOrderItem } from './order-list-item.interface';

export interface IOrder extends Document {
  readonly customerId: string;
  readonly totalPrice: number;
  readonly itemsList: Array<IOrderItem>;
  readonly createdAt: string;
}
