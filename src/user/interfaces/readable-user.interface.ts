import { IAddress } from "./address.interface";

export interface IReadableUser {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly address: IAddress;
  readonly phone: string;
  readonly roles: Array<string>;
  accessToken?: string;
}
