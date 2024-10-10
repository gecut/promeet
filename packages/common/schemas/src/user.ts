import { randomNumber } from '@gecut/utilities/data-types/number.js';
import { uid } from '@gecut/utilities/uid.js';
import { Schema, Types } from 'mongoose';

import type {
  UserInterface,
  UserModel,
  UserInterfaceVirtuals,
  UserInterfaceStatics,
  UserInterfaceInstanceMethods,
  UserInterfaceQueryHelpers,
} from '@promeet/types';

export const $UserSchema = new Schema<
  UserInterface,
  UserModel,
  UserInterfaceInstanceMethods,
  UserInterfaceQueryHelpers,
  UserInterfaceVirtuals,
  UserInterfaceStatics
>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: { type: String, required: false, trim: true },
    disabled: { type: Boolean, default: false },
    token: {
      type: String,
      default: uid,
      unique: true,
      trim: true,
      index: true,
    },

    otp: {
      code: { type: String },
      expiredAt: { type: Date },
    },

    teaching: [{ type: Types.ObjectId, ref: 'group' }],
    studying: [{ type: Types.ObjectId, ref: 'group' }],
  },
  {
    timestamps: true,
    methods: {
      makeToken() {
        this.token = uid();

        this.save();

        return this.token;
      },
      makeOTP() {
        if (this.otp?.code == null || Date.now() > new Date(this.otp.expiredAt).getTime())
          delete this.otp;

        this.otp = {
          code: randomNumber(999999, 111111).toString(),
          expiredAt: new Date(Date.now() + 300000),
        };

        this.save();

        return this.otp.code;
      },
      async calculateAttendanceProgress(groupId) {
        const { teaching, studying } = await this.populate([
          {
            path: 'teaching',
            populate: {
              path: 'sessions',
            },
          },
          {
            path: 'studying',
            populate: {
              path: 'sessions',
            },
          },
        ]);

        const result = {
          sessions: 0,
          presences: 0,
          absences: 0,
          percentage: 0,
        };

        for (const group of teaching.concat(studying)) {
          if (groupId != null && groupId !== group._id.toString()) continue;

          for (const session of group.sessions) {
            const delay = session.attendance[this._id.toString()];

            if (delay == null) continue;

            if (delay < session.length) result.presences++;
            else result.absences++;

            result.sessions++;
          }
        }

        if (result.sessions > 0)
          result.percentage = Math.round((100 * result.presences) / result.sessions);

        return result;
      },
      async calculateDelaysStats(groupId) {
        const { teaching, studying } = await this.populate([
          {
            path: 'teaching',
            populate: {
              path: 'sessions',
            },
          },
          {
            path: 'studying',
            populate: {
              path: 'sessions',
            },
          },
        ]);

        const result = {
          sessions: 0,
          delays: 0,
          percentage: 0,
        };

        for (const group of teaching.concat(studying)) {
          if (groupId != null && groupId !== group._id.toString()) continue;

          for (const session of group.sessions) {
            const delay = session.attendance[this._id.toString()];

            if (delay == null) continue;

            result.delays += delay;
            result.sessions += session.length;
          }
        }

        if (result.sessions > 0) {
          result.percentage = Math.round(
            (100 * (result.sessions - result.delays)) / result.sessions,
          );
        }

        return result;
      },
    },
    virtuals: {
      fullName: {
        get() {
          return this.firstName + ' ' + this.lastName;
        },
      },
    },
  },
);
