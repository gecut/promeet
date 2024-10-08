import { Schema, Types } from 'mongoose'

import type {
  GroupInterface,
  GroupModel,
  GroupInterfaceVirtuals,
  GroupInterfaceStatics,
  GroupInterfaceInstanceMethods,
  GroupInterfaceQueryHelpers,
} from '@promeet/types'

const hour = 1000 * 60 * 60

export const $GroupSchema = new Schema<
  GroupInterface,
  GroupModel,
  GroupInterfaceInstanceMethods,
  GroupInterfaceQueryHelpers,
  GroupInterfaceVirtuals,
  GroupInterfaceStatics
>(
  {
    teachers: [{ type: Types.ObjectId, ref: 'user' }],
    students: [{ type: Types.ObjectId, ref: 'user' }],

    defaultSessionStartedAt: {
      type: Number,
      default: hour * 18, // 0 - 23
    },
    defaultSessionLength: {
      type: Number,
      default: hour * 3, // 3 hour
    },
  },
  {
    timestamps: true,
  },
)
