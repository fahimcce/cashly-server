"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgentApprovalController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const Admin_service_1 = require("./Admin.service");
const getPendingAgents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Admin_service_1.AgentApprovalService.getPendingAgents();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pending agent approvals fetched successfully.",
        data: result,
    });
}));
const acceptAgent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.params;
    const result = yield Admin_service_1.AgentApprovalService.acceptAgent(phone);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
const rejectAgent = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { phone } = req.params;
    const result = yield Admin_service_1.AgentApprovalService.rejectAgent(phone);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
// 🚀 [1] Agent Requests Cash Recharge
const requestCashRecharge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentPhone, amount } = req.body;
    const result = yield Admin_service_1.AgentApprovalService.requestCashRecharge(agentPhone, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Cash recharge request submitted successfully.",
        data: result,
    });
}));
// 🚀 [2] Admin Approves Cash Recharge
const approveCashRecharge = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    const result = yield Admin_service_1.AgentApprovalService.approveCashRecharge(requestId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
// 🚀 [3] Agent Requests Withdrawal
const requestWithdraw = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { agentPhone, amount } = req.body;
    const result = yield Admin_service_1.AgentApprovalService.requestWithdraw(agentPhone, amount);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Withdrawal request submitted successfully.",
        data: result,
    });
}));
// 🚀 [4] Admin Views Pending Withdraw Requests
const getPendingWithdrawRequests = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Admin_service_1.AgentApprovalService.getPendingWithdrawRequests();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Pending withdrawal requests fetched successfully.",
        data: result,
    });
}));
// 🚀 [5] Admin Approves Withdrawal
const approveWithdraw = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { requestId } = req.params;
    const result = yield Admin_service_1.AgentApprovalService.approveWithdraw(requestId);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.message,
        data: result,
    });
}));
const allTransactions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Admin_service_1.AgentApprovalService.allTransactions();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "all transaction fetched",
        data: result,
    });
}));
exports.AgentApprovalController = {
    getPendingAgents,
    acceptAgent,
    rejectAgent,
    requestCashRecharge,
    approveCashRecharge,
    requestWithdraw,
    getPendingWithdrawRequests,
    approveWithdraw,
    allTransactions,
};
