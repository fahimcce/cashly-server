import express from "express";
import validateRequest from "../../middlewares/validRequest";
import { TransactionControllers } from "./Transaction.controller";
import { TransactionValidation } from "./Transaction.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../User/User.constant";

const router = express.Router();

router.post(
  "/send-money",
  validateRequest(TransactionValidation.sendMoneySchema),
  auth(USER_ROLE.USER),
  TransactionControllers.sendMoney
);
router.post(
  "/cash-out",
  validateRequest(TransactionValidation.cashOutSchema),
  auth(USER_ROLE.USER),
  TransactionControllers.cashOut
);
router.get(
  "/balance-inquiry",
  auth(USER_ROLE.AGENT, USER_ROLE.USER, USER_ROLE.ADMIN),
  TransactionControllers.balanceInquiry
);
router.post("/cashin", auth(USER_ROLE.AGENT), TransactionControllers.CashIn);

router.get(
  "/transactions",
  auth(USER_ROLE.AGENT, USER_ROLE.USER),
  TransactionControllers.getLast100Transactions
);
router.get(
  "/admin/transactions/:userPhone",
  TransactionControllers.getTransactionsOfUser
);

router.get("/total-money", TransactionControllers.updateTotalMoney);

export const transactionRoutes = router;
