import { model, Schema } from "mongoose";
import { TUser } from "./Auth.interface";

const userModelSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "user", "agent"],
      required: true,
      default: "user",
    },
    nid: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
    balance: { type: Number, default: 40 },
    pin: { type: String },
    income: { type: Number, default: 0 },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = model<TUser>("User", userModelSchema);
