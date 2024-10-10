import type { Entity, Jsonize } from './core';
import type { GroupInterface, GroupTasksInterface } from './group';
import type { Model } from 'mongoose';

export interface SessionTasksInterface extends GroupTasksInterface {
  done: boolean;
}

export interface SessionInterface extends Entity {
  startedAt: Date;
  length: number;

  summary: string;

  group: GroupInterface;
  attendance: Record<string, number>;

  tasks: SessionTasksInterface[];
}

export interface SessionInterfaceQueryHelpers {}
export interface SessionInterfaceInstanceMethods {
  setDefaults(startDate: number): Promise<SessionInterface>;
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
