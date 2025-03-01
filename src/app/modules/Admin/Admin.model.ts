import mongoose from "mongoose";

const cashTransactionSchema = new mongoose.Schema({
  agentPhone: { type: String, required: true },
  type: { type: String, enum: ["recharge", "withdraw"], required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

export const CashTransaction = mongoose.model(
  "CashTransaction",
  cashTransactionSchema
);
