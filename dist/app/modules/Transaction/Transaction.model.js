"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
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
}, { timestamps: true });
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
