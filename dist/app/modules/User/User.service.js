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
exports.UserService = void 0;
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const Auth_model_1 = require("../Auth/Auth.model");
const Transaction_model_1 = require("../Transaction/Transaction.model");
// Block or Unblock User by admin
const toggleUserStatus = (phone, status) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_model_1.User.findOne({ phone });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    user.isDeleted = status;
    yield user.save();
    return {
        message: status
            ? "User blocked successfully"
            : "User unblocked successfully",
    };
});
// Admin Search User by Phone
const searchUserByPhone = (phone) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield Auth_model_1.User.findOne({ phone });
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const transactions = yield Transaction_model_1.Transaction.find({
        $or: [{ senderPhone: phone }, { receiverPhone: phone }],
    });
    // .sort({ createdAt: -1 })
    // .limit(100);
    return { user, transactions };
});
// Admin Show All Users
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Auth_model_1.User.find();
    return users;
});
const getMe = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const Data = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!Data) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Data not found.");
    }
    return { Data };
});
exports.UserService = {
    toggleUserStatus,
    searchUserByPhone,
    getAllUsers,
    getMe,
};
