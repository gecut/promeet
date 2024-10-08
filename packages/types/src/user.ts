import { PartialDeep } from "@gecut/types";
import { Entity, Jsonize, ModelsType } from "./core";
import { Model } from "mongoose";

export interface OTPInterface {
  code: string;
  expiredAt: Date;
}

export interface UserInterface extends Entity {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;

  token: string;

  otp?: OTPInterface;

  permissions: PartialDeep<
    Record<
      ModelsType,
      {
        read: boolean;
        create: boolean;
        update: boolean;
        delete: boolean;
      }
    >
  >;
}

export interface UserInterfaceQueryHelpers {}
export interface UserInterfaceInstanceMethods {
  makeOTP(): string;
  makeToken(): string;
}
export interface UserInterfaceVirtuals {
  readonly fullName: string;
}
export interface UserInterfaceStatics {}

export type UserModel = Model<
  UserInterface,
  UserInterfaceQueryHelpers,
  UserInterfaceInstanceMethods,
  UserInterfaceVirtuals
>;

export type UserData = Jsonize<UserInterface & UserInterfaceVirtuals>;
