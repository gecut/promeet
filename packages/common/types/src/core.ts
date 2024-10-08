import { Types, Document } from "mongoose";
import { ArrayValues, Jsonify } from "@gecut/types";

export const Models = ["user", "group", "session"] as const;
export type ModelsType = ArrayValues<typeof Models>;

export interface Entity extends Document {
  _id: Types.ObjectId;

  disabled?: boolean;
  createdAt: Date;
}

export type Jsonize<T extends Entity> = Jsonify<
  Omit<T, keyof Document> & { _id: string }
>;
