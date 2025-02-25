import { model, Schema } from "mongoose";
import { TTransaction } from "./Transaction.interface";

const transactionSchema = new Schema<TTransaction>(
  {
    senderPhone: { type: String, required: true },
    receiverPhone: { type: String, required: false },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: ["send-money", "cash-out", "cash-in"],
      required: true,
    },
    fee: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      required: true,
    },
  },
  { timestamps: true }
);

export const Transaction = model<TTransaction>(
  "Transaction",
  transactionSchema
);
