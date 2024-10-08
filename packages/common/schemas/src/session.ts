import { Schema, Types } from 'mongoose'

import type {
  SessionInterface,
  SessionModel,
  SessionInterfaceVirtuals,
  SessionInterfaceStatics,
  SessionInterfaceInstanceMethods,
  SessionInterfaceQueryHelpers,
} from '@promeet/types'

export const $SessionSchema = new Schema<
  SessionInterface,
  SessionModel,
  SessionInterfaceInstanceMethods,
  SessionInterfaceQueryHelpers,
  SessionInterfaceVirtuals,
  SessionInterfaceStatics
>(
  {
    startedAt: {
      type: Date,
      default: () => {
        const now = new Date()

        now.setHours(18)

        return now
      },
    },
    length: {
      type: Number,
      default: 1000 * 60 * 60 * 3, // 3 hour
    },

    group: { type: Types.ObjectId, ref: 'group' },
  },
  {
    timestamps: true,
    methods: {
      async makeFromGroup(startDate) {
        const _this = await this.populate('group')

        this.startedAt = new Date(startDate + _this.group.defaultSessionStartedAt)
        this.length = _this.group.defaultSessionLength

        return await this.save()
      },
    },
    virtuals: {
      endedAt: {
        get() {
          return new Date(this.startedAt.getTime() + this.length)
        },
      },
    },
  },
)
