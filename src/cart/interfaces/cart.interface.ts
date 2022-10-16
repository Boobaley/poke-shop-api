import { Document } from 'mongoose';

import { IOrderItem } from '../../order/interfaces/order-list-item.interface';

export interface ICart extends Document {
  readonly customerId: string;
  readonly totalPrice: number;
  readonly itemsList: Array<IOrderItem>;
  readonly quantity: number;
}
