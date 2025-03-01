import express from "express";
import { AgentApprovalController } from "./Admin.controller";
import { USER_ROLE } from "../User/User.constant";
import auth from "../../middlewares/auth";

const router = express.Router();

router.get(
  "/agent-approval",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.getPendingAgents
);
router.post(
  "/approval-accept/:phone",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.acceptAgent
);
router.post(
  "/approval-reject/:phone",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.rejectAgent
);

router.post(
  "/request-recharge",
  auth(USER_ROLE.AGENT),
  AgentApprovalController.requestCashRecharge
);

router.post(
  "/approve-recharge/:requestId",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.approveCashRecharge
);

router.post(
  "/request-withdraw",
  auth(USER_ROLE.AGENT),
  AgentApprovalController.requestWithdraw
);

router.get(
  "/pending-withdraw",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.getPendingWithdrawRequests
);

router.post(
  "/approve-withdraw/:requestId",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.approveWithdraw
);

router.get(
  "/transactions",
  auth(USER_ROLE.ADMIN),
  AgentApprovalController.allTransactions
);

export const AgentApprovalRoutes = router;
