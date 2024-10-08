import { Entity, Jsonize } from "./core";
import { Model } from "mongoose";
import { UserInterface } from "./user";

export interface GroupInterface extends Entity {
  teachers: Array<UserInterface>;
  students: Array<UserInterface>;

  defaultSessionStartedAt: number;
  defaultSessionLength: number;
}

export interface GroupInterfaceQueryHelpers {}
export interface GroupInterfaceInstanceMethods {}
export interface GroupInterfaceVirtuals {}
export interface GroupInterfaceStatics {}

export type GroupModel = Model<
  GroupInterface,
  GroupInterfaceQueryHelpers,
  GroupInterfaceInstanceMethods,
  GroupInterfaceVirtuals
>;

export type GroupData = Jsonize<GroupInterface & GroupInterfaceVirtuals>;
