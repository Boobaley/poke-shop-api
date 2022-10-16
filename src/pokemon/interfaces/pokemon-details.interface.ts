import { IAbility } from './ability.interface';
import { IStat } from './stat.interface';

export interface IPokemonDetails {
  readonly id: number;
  readonly name: string;
  readonly image: string;
  readonly abilities: Array<IAbility>;
  readonly stats: Array<IStat>;
  readonly price: number
}
