import type { Entity, Jsonize } from './core'
import type { UserInterface } from './user'
import type { Model } from 'mongoose'

export interface GroupInterface extends Entity {
  teachers: UserInterface[]
  students: UserInterface[]

  defaultSessionStartedAt: number
  defaultSessionLength: number
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
>

export type GroupData = Jsonize<GroupInterface & GroupInterfaceVirtuals>
