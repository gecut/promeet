import { Schema } from "mongoose";
import {
  UserInterface,
  UserModel,
  UserInterfaceVirtuals,
  UserInterfaceStatics,
  UserInterfaceInstanceMethods,
  UserInterfaceQueryHelpers,
} from "@promeet/types";
import { uid } from "@gecut/utilities/uid.js";
import { numberUtils } from "@gecut/utilities/data-types/number.js";

export const $UserSchema = new Schema<
  UserInterface,
  UserModel,
  UserInterfaceInstanceMethods,
  UserInterfaceQueryHelpers,
  UserInterfaceVirtuals,
  UserInterfaceStatics
>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: { type: String, required: false, trim: true },
    disabled: { type: Boolean, default: false },
    token: {
      type: String,
      default: uid,
      unique: true,
      trim: true,
      index: true,
    },

    otp: {
      code: { type: String },
      expiredAt: { type: Date },
    },
  },
  {
    timestamps: true,
    methods: {
      makeToken() {
        this.token = uid();

        this.save();

        return this.token;
      },
      makeOTP() {
        if (
          this.otp?.code == null ||
          Date.now() > new Date(this.otp.expiredAt).getTime()
        )
          delete this.otp;

        this.otp = {
          code: numberUtils.random.number(999999, 111111).toString(),
          expiredAt: new Date(Date.now() + 300000),
        };

        this.save();

        return this.otp.code;
      },
    },
    virtuals: {
      fullName: {
        get() {
          return this.firstName + " " + this.lastName;
        },
      },
    },
  }
);
