import * as Mongoose from 'mongoose';

import { genderEnum } from '../enums/gender.enum';
import { rolesEnum } from '../enums/roles.enum';
import { statusEnum } from '../enums/status.enum';

export const UserSchema = new Mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: Object.values(genderEnum),
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    city: {
      type: String,
      default: null,
    },
    country: {
      type: String,
      default: null,
    },
    addressLine1: {
      type: String,
      default: null,
    },
    addressLine2: {
      type: String,
      default: null,
    },
  },
  phone: {
    type: String,
    default: null,
  },
  roles: {
    type: [String],
    default: rolesEnum.customer,
    enum: Object.values(rolesEnum),
  },
});

UserSchema.index({ email: 1 }, { unique: true });
