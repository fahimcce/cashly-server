import express from "express";
import { AgentApprovalController } from "./Admin.controller";

const router = express.Router();

router.get("/agent-approval", AgentApprovalController.getPendingAgents);
router.post("/approval-accept/:phone", AgentApprovalController.acceptAgent);
router.post("/approval-reject/:phone", AgentApprovalController.rejectAgent);

export const AgentApprovalRoutes = router;
