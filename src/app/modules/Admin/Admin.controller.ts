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

export const AgentApprovalController = {
  getPendingAgents,
  acceptAgent,
  rejectAgent,
};
