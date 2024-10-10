import type { Entity, Jsonize } from './core';
import type { SessionInterface } from './session';
import type { UserInterface } from './user';
import type { Model } from 'mongoose';

export interface GroupTasksInterface {
  taskId: string;
  title: string;
  description: string;
}

export interface GroupTasksStatsInterface extends GroupTasksInterface {
  done: number;
  failed: number;
  percentage: number;
}

export interface GroupInterface extends Entity {
  teachers: UserInterface[];
  students: UserInterface[];

  sessionDefaults: {
    startedAt: number;
    length: number;
  };

  sessions: SessionInterface[];

  tasks: GroupTasksInterface[];
}

export interface GroupInterfaceQueryHelpers {}
export interface GroupInterfaceInstanceMethods {
  calculateTasksStats(sessionId?: string): Promise<GroupTasksStatsInterface[]>;
}
export interface GroupInterfaceVirtuals {}
export interface GroupInterfaceStatics {}

export type GroupModel = Model<
  GroupInterface,
  GroupInterfaceQueryHelpers,
  GroupInterfaceInstanceMethods,
  GroupInterfaceVirtuals
>;

export type GroupData = Jsonize<GroupInterface & GroupInterfaceVirtuals>;
