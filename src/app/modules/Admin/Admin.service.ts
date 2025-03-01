import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../Auth/Auth.model";
import { CashTransaction } from "./Admin.model";
import { Transaction } from "../Transaction/Transaction.model";

const getPendingAgents = async () => {
  const agents = await User.find({ role: "agent", isApproved: false });
  return agents;
};

const acceptAgent = async (agentPhone: string) => {
  const agent = await User.findOne({ phone: agentPhone, role: "agent" });
  if (!agent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agent not found.");
  }

  agent.isApproved = true;
  await agent.save();

  return { message: "Agent approved successfully." };
};

const rejectAgent = async (agentPhone: string) => {
  const agent = await User.findOne({ phone: agentPhone, role: "agent" });
  if (!agent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agent not found.");
  }
  agent.isApproved = false;
  await agent.save();

  return { message: "Agent rejected successfully." };
};

//  Agent Requests Balance Recharge
const requestCashRecharge = async (agentPhone: string, amount: number) => {
  const agent = await User.findOne({ phone: agentPhone, role: "agent" });
  if (!agent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agent not found.");
  }

  return await CashTransaction.create({
    agentPhone,
    type: "recharge",
    amount,
    status: "pending",
  });
};

//  Admin Approves Cash Recharge (100,000 Dummy Amount)
const approveCashRecharge = async (requestId: string) => {
  const request = await CashTransaction.findById(requestId);
  if (!request || request.type !== "recharge") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request.");
  }
  if (request.status !== "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already processed.");
  }

  request.status = "approved";
  await request.save();

  const agent = await User.findOne({ phone: request.agentPhone });
  if (agent) {
    agent.balance += 100000; // Dummy recharge amount
    await agent.save();
  }

  return { message: "Cash recharge approved successfully." };
};

// Agent Requests Withdrawal
const requestWithdraw = async (agentPhone: string, amount: number) => {
  const agent = await User.findOne({ phone: agentPhone, role: "agent" });
  if (!agent) {
    throw new ApiError(httpStatus.NOT_FOUND, "Agent not found.");
  }
  if (agent.income < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient income balance.");
  }

  return await CashTransaction.create({
    agentPhone,
    type: "withdraw",
    amount,
    status: "pending",
  });
};

// Admin Views Pending Withdraw Requests
const getPendingWithdrawRequests = async () => {
  return await CashTransaction.find({ type: "withdraw", status: "pending" });
};

// Admin Approves Withdrawal Request
const approveWithdraw = async (requestId: string) => {
  const request = await CashTransaction.findById(requestId);
  if (!request || request.type !== "withdraw") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid request.");
  }
  if (request.status !== "pending") {
    throw new ApiError(httpStatus.BAD_REQUEST, "Request already processed.");
  }

  request.status = "approved";
  await request.save();

  const agent = await User.findOne({ phone: request.agentPhone });
  if (agent) {
    if (agent.income < request.amount) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient income.");
    }
    agent.income -= request.amount;
    await agent.save();
  }

  return { message: "Withdrawal approved successfully." };
};

const allTransactions = async () => {
  const result = await Transaction.find();
  return result;
};

export const AgentApprovalService = {
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
