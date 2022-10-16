import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { AuthUser } from '../helpers/decorators/auth-user.decorator';
import { ITokenPayload } from '../token/interfaces/token-payload.interface';
import { CreateOrderItemDto } from '../order/dto/create-order-item.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('/')
  @ApiResponse({ description: 'Get cart current state', status: 200 })
  async findOne(@AuthUser() tokenData: ITokenPayload) {
    const { _id } = tokenData;
    const result = await this.cartService.getCartInfo(_id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Post('/item')
  @ApiResponse({ description: 'Add new item to cart', status: 200 })
  async addToCart(@Body() body: CreateOrderItemDto, @AuthUser() tokenData: ITokenPayload) {
    const { _id } = tokenData;

    const result = await this.cartService.addItem(_id, body);

    if (!result) {
      throw new ForbiddenException(`Item with id: ${body.id} is already in the cart`);
    }

    return result;
  }

  @Patch('/item')
  async updateItem(@Body() body: UpdateCartDto, @AuthUser() tokenData: ITokenPayload) {
    const { _id } = tokenData;

    const result = await this.cartService.update(_id, body);

    if (!result) {
      throw new NotFoundException(`Item with id: ${body.id} is not found`);
    }

    return result;
  }

  @Delete('/item/:id')
  @ApiResponse({ description: 'Remove item from cart', status: 200 })
  async deleteCartItem(@Param('id') itemId: string, @AuthUser() tokenData: ITokenPayload) {
    const { _id } = tokenData;

    const result = await this.cartService.removeItemFromCart(_id, +itemId);

    if (!result) {
      throw new NotFoundException(`Item with id: ${itemId} is not found`);
    }

    return result;
  }
}
