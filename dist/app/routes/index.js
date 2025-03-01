"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_routes_1 = require("../modules/Auth/Auth.routes");
const Transaction_routes_1 = require("../modules/Transaction/Transaction.routes");
const User_routes_1 = require("../modules/User/User.routes");
const Admin_routes_1 = require("../modules/Admin/Admin.routes");
const router = express_1.default.Router();
const moudleRoute = [
    {
        path: "/auth",
        route: Auth_routes_1.authRoutes,
    },
    {
        path: "/transaction",
        route: Transaction_routes_1.transactionRoutes,
    },
    {
        path: "/user",
        route: User_routes_1.UserRoutes,
    },
    {
        path: "/admin",
        route: Admin_routes_1.AgentApprovalRoutes,
    },
    //   {
    //     path: "/user",
    //     route: userRoutes,
    //   },
];
moudleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
