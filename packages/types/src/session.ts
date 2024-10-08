import { Entity, Jsonize } from "./core";
import { Model } from "mongoose";
import { GroupInterface } from "./group";

export interface SessionInterface extends Entity {
  startedAt: Date;
  length: number;

  group: GroupInterface;
}

export interface SessionInterfaceQueryHelpers {}
export interface SessionInterfaceInstanceMethods {
  makeFromGroup(startDate: number): Promise<SessionInterface>;
}
export interface SessionInterfaceVirtuals {
  readonly endedAt: Date;
}
export interface SessionInterfaceStatics {}

export type SessionModel = Model<
  SessionInterface,
  SessionInterfaceQueryHelpers,
  SessionInterfaceInstanceMethods,
  SessionInterfaceVirtuals
>;

export type SessionData = Jsonize<SessionInterface & SessionInterfaceVirtuals>;
