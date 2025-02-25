import express from "express";
import validateRequest from "../../middlewares/validRequest";
import { TransactionControllers } from "./Transaction.controller";
import { TransactionValidation } from "./Transaction.validation";

const router = express.Router();

router.post(
  "/send-money",
  validateRequest(TransactionValidation.sendMoneySchema),
  TransactionControllers.sendMoney
);
router.post(
  "/cash-out",
  validateRequest(TransactionValidation.cashOutSchema),
  TransactionControllers.cashOut
);
router.post(
  "/balance-inquiry",
  validateRequest(TransactionValidation.balanceInquirySchema),
  TransactionControllers.balanceInquiry
);
router.post("/cashin", TransactionControllers.CashIn);

router.get(
  "/transactions/:phone",
  TransactionControllers.getLast100Transactions
);
router.get(
  "/admin/transactions/:userPhone",
  TransactionControllers.getTransactionsOfUser
);

export const transactionRoutes = router;
