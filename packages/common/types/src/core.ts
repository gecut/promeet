import type { ArrayValues, Jsonify } from '@gecut/types';
import type { Types, Document } from 'mongoose';

export const Models = ['user', 'group', 'session'] as const;
export type ModelsType = ArrayValues<typeof Models>;

export interface Entity extends Document {
  _id: Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}

export type Jsonize<T extends Entity> = Jsonify<Omit<T, keyof Document> & { _id: string }>;
