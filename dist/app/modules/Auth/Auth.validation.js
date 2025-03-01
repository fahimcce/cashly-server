"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registrationSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(1, "Name is required"),
        phone: zod_1.z
            .string()
            .regex(/^01\d{9}$/, "Invalid mobile number format (must be 11 digits and start with 01)"),
        email: zod_1.z.string().email("Invalid email format"),
        password: zod_1.z
            .string()
            .length(5, "PIN must be exactly 5 digits")
            .regex(/^\d{5}$/, "PIN must contain only numbers"),
        role: zod_1.z.enum(["admin", "user", "agent"], {
            message: "Role must be 'admin', 'user'",
        }),
        nid: zod_1.z
            .string()
            .length(10, "NID must be exactly 10 digits")
            .regex(/^\d{10}$/, "NID must be numeric"),
        isDeleted: zod_1.z.boolean().optional().default(false),
    }),
});
exports.AuthValidation = {
    registrationSchema,
};
