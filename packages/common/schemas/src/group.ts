import { uid } from '@gecut/utilities/uid.js';
import { Schema, Types } from 'mongoose';

import type {
  GroupInterface,
  GroupModel,
  GroupInterfaceVirtuals,
  GroupInterfaceStatics,
  GroupInterfaceInstanceMethods,
  GroupInterfaceQueryHelpers,
  GroupTasksInterface,
  GroupTasksStatsInterface,
} from '@promeet/types';

const hour = 1000 * 60 * 60;

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

    sessionDefaults: {
      startedAt: {
        type: Number,
        default: hour * 18, // 0 - 23
      },
      length: {
        type: Number,
        default: hour * 3, // 3 hour
      },
    },

    sessions: [{ type: Types.ObjectId, ref: 'session' }],
    tasks: [
      new Schema<GroupTasksInterface>(
        {
          taskId: { type: String, default: uid },
          title: { type: String },
          description: { type: String },
        },
        { _id: false },
      ),
    ],
  },
  {
    timestamps: true,
    methods: {
      async calculateTasksStats(sessionId) {
        const result: GroupTasksStatsInterface[] = [];

        const { sessions } = await this.populate('sessions');

        for (const session of sessions) {
          if (sessionId != null && sessionId !== session._id.toString()) continue;

          for (const task of session.tasks) {
            const findTask = result.find((resultTask) => resultTask.taskId === task.taskId);

            if (findTask) {
              if (task.done === true) findTask.done++;
              else findTask.failed++;
            } else {
              result.push({
                ...task,

                done: task.done ? 1 : 0,
                failed: task.done ? 0 : 1,
                percentage: 0,
              });
            }
          }
        }

        for (const task of result) {
          if (task.done + task.failed > 0)
            task.percentage = Math.round((100 * task.done) / (task.done + task.failed));
        }

        return result;
      },
    },
  },
);
