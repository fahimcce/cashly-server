import { z } from "zod";

const registrationSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    phone: z
      .string()
      .regex(
        /^01\d{9}$/,
        "Invalid mobile number format (must be 11 digits and start with 01)"
      ),
    email: z.string().email("Invalid email format"),
    password: z
      .string()
      .length(5, "PIN must be exactly 5 digits")
      .regex(/^\d{5}$/, "PIN must contain only numbers"),

    role: z.enum(["admin", "user", "agent"], {
      message: "Role must be 'admin', 'user'",
    }),
    nid: z
      .string()
      .length(10, "NID must be exactly 10 digits")
      .regex(/^\d{10}$/, "NID must be numeric"),
    isDeleted: z.boolean().optional().default(false),
  }),
});

export const AuthValidation = {
  registrationSchema,
};
