import * as Mongoose from 'mongoose';

export const OrderSchema = new Mongoose.Schema({
  customerId: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  itemsList: [
    {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  createdAt: { type: Date, required: true },
});
