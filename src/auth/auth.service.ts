import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions } from 'jsonwebtoken';
import * as moment from 'moment';
import * as bcrypt from 'bcrypt';
import * as _ from 'lodash';

import { CreateUserTokenDto } from 'src/token/dto/create-user-token.dto';
import { UserService } from 'src/user/user.service';
import { TokenService } from 'src/token/token.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { IReadableUser } from '../user/interfaces/readable-user.interface';
import { ITokenPayload } from '../token/interfaces/token-payload.interface';
import { userSensitiveFieldsEnum } from '../user/enums/protected-fields.enum';
import { CartService } from '../cart/cart.service';
import { CreateCartDto } from '../cart/dto/create-cart.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly cartService: CartService
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<any> {
    try {
      const createdUser = await this.userService.create(createUserDto);

      const cartDto: CreateCartDto = {
        customerId: createdUser._id,
      };

      await this.cartService.create(cartDto);

      return {
        success: true,
        message: 'Your account successfully has been created',
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async signIn({ email, password }: SignInDto): Promise<IReadableUser> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const isCredentialsValid: boolean = await bcrypt.compare(password, user.password);

    if (!isCredentialsValid) {
      throw new BadRequestException('Invalid credentials');
    }

    await this.tokenService.deleteAll(user._id);

    const tokenPayload: ITokenPayload = {
      _id: user._id,
      roles: user.roles,
    };

    const token = await this.generateToken(tokenPayload);

    const expireAt = moment()
      .add(1, 'day')
      .toISOString();

    await this.saveToken({
      token,
      expireAt,
      uId: user._id,
    });

    const userToSend = user.toObject() as IReadableUser;

    userToSend.accessToken = token;

    return _.omit<any>(userToSend, Object.values(userSensitiveFieldsEnum)) as IReadableUser;
  }

  private async generateToken(data: ITokenPayload, options?: SignOptions): Promise<string> {
    return this.jwtService.sign(data, options);
  }

  private async verifyToken(token): Promise<any> {
    try {
      const data = this.jwtService.verify(token);
      const tokenExists = await this.tokenService.exists(data._id, token);

      if (tokenExists) {
        return data;
      }
      throw new UnauthorizedException();
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  private async saveToken(createUserTokenDto: CreateUserTokenDto) {
    return await this.tokenService.create(createUserTokenDto);
  }
}
