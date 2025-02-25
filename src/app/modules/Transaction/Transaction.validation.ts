import { z } from "zod";

const sendMoneySchema = z.object({
  body: z.object({
    senderPhone: z.string().length(11, "Phone number must be 11 digits"),
    receiverPhone: z
      .string()
      .length(11, "Receiver phone number must be 11 digits"),
    amount: z.number().min(50, "Minimum amount is 50 taka"),
  }),
});

const cashOutSchema = z.object({
  body: z.object({
    userPhone: z.string().length(11, "Phone number must be 11 digits"),
    amount: z.number().min(50, "Minimum amount for cash-out is 50 taka"),
    password: z.string().length(5, "PIN must be 5 digits"),
  }),
});

const balanceInquirySchema = z.object({
  body: z.object({
    userPhone: z.string().length(11, "Phone number must be 11 digits"),
  }),
});

export const TransactionValidation = {
  sendMoneySchema,
  cashOutSchema,
  balanceInquirySchema,
};
