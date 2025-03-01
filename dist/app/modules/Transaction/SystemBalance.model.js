"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemBalance = void 0;
const mongoose_1 = require("mongoose");
const systemBalanceSchema = new mongoose_1.Schema({
    totalMoney: { type: Number, required: true, default: 0 },
}, { timestamps: true });
exports.SystemBalance = (0, mongoose_1.model)("SystemBalance", systemBalanceSchema);
