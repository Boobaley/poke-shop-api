import * as Mongoose from 'mongoose';

export const CartSchema = new Mongoose.Schema({
  customerId: {
    type: Mongoose.Types.ObjectId,
    required: true,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  itemsList: {
    type: [
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
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
  quantity: {
    type: Number,
    default: 0,
  },
  // versionKey: false,
});
