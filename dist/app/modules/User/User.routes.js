"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const User_controller_1 = require("./User.controller");
const User_constant_1 = require("./User.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.get("/", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), User_controller_1.UserController.getAllUsers);
router.patch("/status/:phone", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), User_controller_1.UserController.toggleUserStatus);
router.get("/search/:phone", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN), User_controller_1.UserController.searchUserByPhone);
router.get("/me", (0, auth_1.default)(User_constant_1.USER_ROLE.ADMIN, User_constant_1.USER_ROLE.AGENT, User_constant_1.USER_ROLE.USER), User_controller_1.UserController.getMe);
exports.UserRoutes = router;
