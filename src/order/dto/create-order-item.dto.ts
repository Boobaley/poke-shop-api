import { IsNumber, IsString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @IsNumber()
  @ApiProperty()
  readonly id: number;

  @IsString()
  @ApiProperty()
  readonly name: string;

  @IsString()
  @ApiProperty()
  readonly image: string;

  @IsNumber()
  @Min(1)
  @ApiProperty()
  readonly quantity: number;

  @IsNumber()
  @ApiProperty()
  readonly price: number;
}
