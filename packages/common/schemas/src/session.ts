import { uid } from '@gecut/utilities/uid';
import { Schema, Types } from 'mongoose';

import type {
  SessionInterface,
  SessionModel,
  SessionInterfaceVirtuals,
  SessionInterfaceStatics,
  SessionInterfaceInstanceMethods,
  SessionInterfaceQueryHelpers,
  SessionTasksInterface,
} from '@promeet/types';

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
        const now = new Date();

        now.setHours(18);

        return now;
      },
    },
    length: {
      type: Number,
      default: 1000 * 60 * 60 * 3, // 3 hour
    },

    summary: { type: String, default: '' },

    group: { type: Types.ObjectId, ref: 'group' },

    attendance: { type: Object, default: {} },

    tasks: [
      new Schema<SessionTasksInterface>(
        {
          taskId: { type: String, default: uid },
          title: { type: String },
          description: { type: String },
          done: { type: Boolean, default: false },
        },
        { _id: false },
      ),
    ],
  },
  {
    timestamps: true,
    methods: {
      async setDefaults(startDate) {
        const { group } = await this.populate({
          path: 'group',
          populate: [
            {
              path: 'teachers',
            },
            {
              path: 'students',
            },
          ],
        });

        this.startedAt = new Date(startDate + group.sessionDefaults.startedAt);
        this.length = group.sessionDefaults.length;
        this.tasks = group.tasks.map((task) => ({ ...task, done: false }));

        for (const teacher of group.teachers) this.attendance[teacher._id.toString()] = this.length;

        for (const student of group.students) this.attendance[student._id.toString()] = this.length;

        return await this.save();
      },
    },
    virtuals: {
      endedAt: {
        get() {
          return new Date(this.startedAt.getTime() + this.length);
        },
      },
    },
  },
);
