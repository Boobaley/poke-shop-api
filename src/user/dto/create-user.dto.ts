import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  IsOptional,
  IsEnum
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { CreateAddressDto } from "./create-address.dto";
import { genderEnum } from "../enums/gender.enum";

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  readonly email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly lastName: string;

  @IsOptional()
  @ApiPropertyOptional()
  readonly address: CreateAddressDto;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsEnum(genderEnum)
  readonly gender: string;

  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/,
    { message: "Weak password" }
  )
  @ApiProperty()
  readonly password: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly phone: string;

  readonly roles: Array<string>;
}
