import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { UserModule } from '../user/user.module';
import { OrderSchema } from './schemas/order.schema';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    UserModule,
    CartModule,
  ],
  providers: [OrderService],
  controllers: [OrderController],
})
export class OrderModule {}
