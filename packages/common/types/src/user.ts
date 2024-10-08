import type { Entity, Jsonize, ModelsType } from './core';
import type { GroupInterface } from './group';
import type { PartialDeep } from '@gecut/types';
import type { Model } from 'mongoose';

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

  teaching: GroupInterface[];
  studying: GroupInterface[];
}

export interface UserInterfaceQueryHelpers {}
export interface UserInterfaceInstanceMethods {
  makeOTP(): string;
  makeToken(): string;
  calculateAttendanceProgress(groupId?: string): Promise<{
    sessions: number;
    presences: number;
    absences: number;
    percentage: number;
  }>;
  calculateDelaysStats(groupId?: string): Promise<{
    sessions: number; // * To Minutes
    delays: number; // * To Minutes
    percentage: number;
  }>;
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
