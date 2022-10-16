import { Document } from 'mongoose';

export interface ICartItem extends Document {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  quantity: number;
  readonly price: number;
}
