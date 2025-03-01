"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CashTransaction = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cashTransactionSchema = new mongoose_1.default.Schema({
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
exports.CashTransaction = mongoose_1.default.model("CashTransaction", cashTransactionSchema);
