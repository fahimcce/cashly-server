import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../Auth/Auth.model";

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

export const AgentApprovalService = {
  getPendingAgents,
  acceptAgent,
  rejectAgent,
};
