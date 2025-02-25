import express from "express";
import { authRoutes } from "../modules/Auth/Auth.routes";
import { transactionRoutes } from "../modules/Transaction/Transaction.routes";
import { UserRoutes } from "../modules/User/User.routes";
import { AgentApprovalRoutes } from "../modules/Admin/Admin.routes";

const router = express.Router();

const moudleRoute = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/transaction",
    route: transactionRoutes,
  },
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AgentApprovalRoutes,
  },
  //   {
  //     path: "/user",
  //     route: userRoutes,
  //   },
];

moudleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
