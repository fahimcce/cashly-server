"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentApprovalRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Admin_controller_1 = require("./Admin.controller");
const User_constant_1 = require("../User/User.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/agent-approval", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.getPendingAgents);
router.post("/approval-accept/:phone", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.acceptAgent);
router.post("/approval-reject/:phone", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.rejectAgent);
// Agent Requests Balance Recharge
router.post("/request-recharge", (0, auth_1.default)(User_constant_1.USER_ROLE.AGENT), Admin_controller_1.AgentApprovalController.requestCashRecharge);
// Admin Approves Recharge
router.post("/approve-recharge/:requestId", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.approveCashRecharge);
// Agent Requests Withdrawal
router.post("/request-withdraw", (0, auth_1.default)(User_constant_1.USER_ROLE.AGENT), Admin_controller_1.AgentApprovalController.requestWithdraw);
// Admin Views Pending Withdraw Requests
router.get("/pending-withdraw", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.getPendingWithdrawRequests);
// Admin Approves Withdrawal
router.post("/approve-withdraw/:requestId", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), Admin_controller_1.AgentApprovalController.approveWithdraw);
router.get("/transactions", 
// auth(USER_ROLE.ADMIN),
Admin_controller_1.AgentApprovalController.allTransactions);
exports.AgentApprovalRoutes = router;
