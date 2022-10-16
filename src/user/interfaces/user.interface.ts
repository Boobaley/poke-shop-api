import { Document } from "mongoose";

import { IAddress } from "./address.interface";

export interface IUser extends Document {
  readonly email: string;
  status: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly gender: string;
  readonly password: string;
  readonly address: IAddress;
  readonly phone: string;
  readonly roles: Array<string>;
}
