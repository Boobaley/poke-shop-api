import { IsString } from 'class-validator';

export class CreateCartDto {
  @IsString()
  readonly customerId: string;
}
