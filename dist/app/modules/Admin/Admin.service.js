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
exports.AgentApprovalService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const Auth_model_1 = require("../Auth/Auth.model");
const Admin_model_1 = require("./Admin.model");
const Transaction_model_1 = require("../Transaction/Transaction.model");
const getPendingAgents = () => __awaiter(void 0, void 0, void 0, function* () {
    const agents = yield Auth_model_1.User.find({ role: "agent", isApproved: false });
    return agents;
});
const acceptAgent = (agentPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield Auth_model_1.User.findOne({ phone: agentPhone, role: "agent" });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Agent not found.");
    }
    agent.isApproved = true;
    yield agent.save();
    return { message: "Agent approved successfully." };
});
const rejectAgent = (agentPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield Auth_model_1.User.findOne({ phone: agentPhone, role: "agent" });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Agent not found.");
    }
    agent.isApproved = false;
    yield agent.save();
    return { message: "Agent rejected successfully." };
});
//  Agent Requests Balance Recharge
const requestCashRecharge = (agentPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield Auth_model_1.User.findOne({ phone: agentPhone, role: "agent" });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Agent not found.");
    }
    return yield Admin_model_1.CashTransaction.create({
        agentPhone,
        type: "recharge",
        amount,
        status: "pending",
    });
});
// 🚀 [2] Admin Approves Cash Recharge (100,000 Dummy Amount)
const approveCashRecharge = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield Admin_model_1.CashTransaction.findById(requestId);
    if (!request || request.type !== "recharge") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request.");
    }
    if (request.status !== "pending") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Request already processed.");
    }
    request.status = "approved";
    yield request.save();
    const agent = yield Auth_model_1.User.findOne({ phone: request.agentPhone });
    if (agent) {
        agent.balance += 100000; // Dummy recharge amount
        yield agent.save();
    }
    return { message: "Cash recharge approved successfully." };
});
// 🚀 [3] Agent Requests Withdrawal
const requestWithdraw = (agentPhone, amount) => __awaiter(void 0, void 0, void 0, function* () {
    const agent = yield Auth_model_1.User.findOne({ phone: agentPhone, role: "agent" });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Agent not found.");
    }
    if (agent.income < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient income balance.");
    }
    return yield Admin_model_1.CashTransaction.create({
        agentPhone,
        type: "withdraw",
        amount,
        status: "pending",
    });
});
// 🚀 [4] Admin Views Pending Withdraw Requests
const getPendingWithdrawRequests = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Admin_model_1.CashTransaction.find({ type: "withdraw", status: "pending" });
});
// 🚀 [5] Admin Approves Withdrawal Request
const approveWithdraw = (requestId) => __awaiter(void 0, void 0, void 0, function* () {
    const request = yield Admin_model_1.CashTransaction.findById(requestId);
    if (!request || request.type !== "withdraw") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Invalid request.");
    }
    if (request.status !== "pending") {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Request already processed.");
    }
    request.status = "approved";
    yield request.save();
    const agent = yield Auth_model_1.User.findOne({ phone: request.agentPhone });
    if (agent) {
        if (agent.income < request.amount) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient income.");
        }
        agent.income -= request.amount;
        yield agent.save();
    }
    return { message: "Withdrawal approved successfully." };
});
const allTransactions = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield Transaction_model_1.Transaction.find();
    return result;
});
exports.AgentApprovalService = {
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
