import { Controller, Post, Body, Get, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { SignInDto } from './dto/signin.dto';
import { IReadableUser } from '../user/interfaces/readable-user.interface';
import { JwtAuthGuard } from './jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body() createUserDto: CreateUserDto
  ): Promise<{ message: string; success: boolean }> {
    const result = await this.authService.signUp(createUserDto);

    if (!result) {
      throw new BadRequestException('User with this email is already exists');
    }

    return result;
  }

  @Post('/signIn')
  async signIn(@Body() signInDto: SignInDto): Promise<IReadableUser> {
    return this.authService.signIn(signInDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('protected')
  async testProtection(): Promise<{ access: boolean }> {
    return { access: true };
  }
}
