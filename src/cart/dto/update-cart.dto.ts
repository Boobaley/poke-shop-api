import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCartDto {
  @ApiProperty()
  @IsNumber()
  readonly id: number;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
