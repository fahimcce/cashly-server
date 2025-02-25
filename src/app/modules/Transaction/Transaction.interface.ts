import { TUserRole } from "../Auth/Auth.interface";

export type TTransactionType = "send-money" | "cash-out" | "cash-in";

export type TTransaction = {
  senderPhone: string;
  receiverPhone?: string; // Optional for cash-out and cash-in
  amount: number;
  transactionType: TTransactionType;
  fee: number;
  status: "pending" | "completed" | "failed";
  createdAt: Date;
  updatedAt: Date;
};

export type TBalanceInquiry = {
  userPhone: string;
  role: TUserRole; // admin, user, agent
};
