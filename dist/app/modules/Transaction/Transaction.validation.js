"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionValidation = void 0;
const zod_1 = require("zod");
const sendMoneySchema = zod_1.z.object({
    body: zod_1.z.object({
        receiverPhone: zod_1.z
            .string()
            .length(11, "Receiver phone number must be 11 digits"),
        amount: zod_1.z.number().min(50, "Minimum amount is 50 taka"),
        password: zod_1.z.string(),
    }),
});
const cashOutSchema = zod_1.z.object({
    body: zod_1.z.object({
        agentPhone: zod_1.z.string().length(11, "Phone number must be 11 digits"),
        amount: zod_1.z.number().min(50, "Minimum amount for cash-out is 50 taka"),
        password: zod_1.z.string().length(5, "PIN must be 5 digits"),
    }),
});
exports.TransactionValidation = {
    sendMoneySchema,
    cashOutSchema,
};
