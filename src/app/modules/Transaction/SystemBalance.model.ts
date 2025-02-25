import { Schema, model } from "mongoose";

const systemBalanceSchema = new Schema(
  {
    totalMoney: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const SystemBalance = model("SystemBalance", systemBalanceSchema);
