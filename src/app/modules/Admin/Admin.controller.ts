import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { AgentApprovalService } from "./Admin.service";

const getPendingAgents = catchAsync(async (req, res) => {
  const result = await AgentApprovalService.getPendingAgents();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending agent approvals fetched successfully.",
    data: result,
  });
});

const acceptAgent = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const result = await AgentApprovalService.acceptAgent(phone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const rejectAgent = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const result = await AgentApprovalService.rejectAgent(phone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const requestCashRecharge = catchAsync(async (req, res) => {
  const { agentPhone, amount } = req.body;
  const result = await AgentApprovalService.requestCashRecharge(
    agentPhone,
    amount
  );
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Cash recharge request submitted successfully.",
    data: result,
  });
});

const approveCashRecharge = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const result = await AgentApprovalService.approveCashRecharge(requestId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const requestWithdraw = catchAsync(async (req, res) => {
  const { agentPhone, amount } = req.body;
  const result = await AgentApprovalService.requestWithdraw(agentPhone, amount);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Withdrawal request submitted successfully.",
    data: result,
  });
});

const getPendingWithdrawRequests = catchAsync(async (req, res) => {
  const result = await AgentApprovalService.getPendingWithdrawRequests();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Pending withdrawal requests fetched successfully.",
    data: result,
  });
});

const approveWithdraw = catchAsync(async (req, res) => {
  const { requestId } = req.params;
  const result = await AgentApprovalService.approveWithdraw(requestId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const allTransactions = catchAsync(async (req, res) => {
  const result = await AgentApprovalService.allTransactions();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "all transaction fetched",
    data: result,
  });
});

export const AgentApprovalController = {
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
