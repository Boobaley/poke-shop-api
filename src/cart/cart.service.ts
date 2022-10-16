import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ICart } from './interfaces/cart.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderItemDto } from '../order/dto/create-order-item.dto';
import { ICartItem } from './interfaces/cart-item.interface';
import { IUpdatedCart } from './interfaces/cart-updated.interface';

@Injectable()
export class CartService {
  constructor(@InjectModel('Cart') private readonly cartModel: Model<ICart>) {}

  async create(createCartDto: CreateCartDto): Promise<ICart> {
    try {
      return await new this.cartModel(createCartDto).save();
    } catch (error) {
      console.log('!!!', error);
    }
  }

  async getCartInfo(customerId: string): Promise<ICart> {
    try {
      return await this.cartModel.findOne({ customerId }).exec();
    } catch (error) {
      console.log(error);
    }
  }

  async addItem(customerId: string, addCartItemDto: CreateOrderItemDto): Promise<ICart> {
    try {
      const { id: itemId, price, quantity } = addCartItemDto;

      return await this.cartModel
        .findOneAndUpdate(
          {
            customerId,

            'itemsList.id': {
              $ne: itemId,
            },
          },
          {
            $push: { itemsList: addCartItemDto },
            $inc: { quantity: 1, totalPrice: price * quantity },
          },
          { new: true, useFindAndModify: false }
        )
        .exec();
    } catch (error) {}
  }

  async update(customerId: string, updateCartDto: UpdateCartDto): Promise<IUpdatedCart> {
    try {
      const { id, quantity: newQuantity } = updateCartDto;

      const userCart: ICart = await this.cartModel.findOne({ customerId }).exec();

      const { itemsList: currentItemsList } = userCart;

      const itemToUpdate = currentItemsList.find((item) => item.id === id);

      // @ts-ignore
      itemToUpdate.quantity = newQuantity;

      const updatedTotalPrice = currentItemsList.reduce((totalPrice, item) => {
        return totalPrice + item.price * item.quantity;
      }, 0);

      const updatedCart = await this.cartModel.findOneAndUpdate(
        { customerId, 'itemsList.id': id },
        {
          $set: { 'itemsList.$.quantity': newQuantity },
          totalPrice: updatedTotalPrice,
        },
        { new: true, useFindAndModify: false }
      );

      return {
        cartState: {
          quantity: updatedCart.quantity,
          totalPrice: updatedCart.totalPrice,
        },
        updatedItem: itemToUpdate,
      };
    } catch (error) {
      console.log(error);

      return null;
    }
  }

  async removeItemFromCart(customerId: string, id: number) {
    try {
      const userCard = await this.cartModel.findOne({ customerId }).exec();

      const itemToRemove = userCard.itemsList.find((item) => item.id === id);

      const { quantity, price } = itemToRemove;

      const updatedCart: ICart = await this.cartModel
        .findOneAndUpdate(
          {
            customerId,
          },
          {
            $pull: { itemsList: { id } },
            $inc: { quantity: -1, totalPrice: -(price * quantity) },
          },
          { new: true, useFindAndModify: false }
        )
        .exec();

      return {
        cartState: {
          quantity: updatedCart.quantity,
          totalPrice: updatedCart.totalPrice,
        },
        removedItemId: id,
      };
    } catch (error) {
      return null;
    }
  }

  async clearCart(customerId: string): Promise<void> {
    try {
      await this.cartModel
        .findOneAndUpdate(
          { customerId },
          {
            totalPrice: 0,
            quantity: 0,
            itemsList: [],
          }
        )
        .exec();
    } catch (error) {
      console.log(error);
    }
  }
}
