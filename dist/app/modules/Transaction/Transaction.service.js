"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TransactionServices = void 0;
const Transaction_model_1 = require("./Transaction.model");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const Auth_model_1 = require("../Auth/Auth.model");
const bcrypt = __importStar(require("bcrypt"));
const SystemBalance_model_1 = require("./SystemBalance.model");
const sendMoney = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { receiverPhone, amount, password } = req.body;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const sender = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!sender) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender not found.");
    }
    const senderPhone = sender === null || sender === void 0 ? void 0 : sender.phone;
    //password test
    const isPasswordValid = yield bcrypt.compare(password, sender.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password incorrect! Try again.");
    }
    const receiver = yield Auth_model_1.User.findOne({ phone: receiverPhone });
    if (!receiver) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Receiver not found.");
    }
    if (sender.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance.");
    }
    if (amount < 50) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Minimum amount 50 for send money.");
    }
    const fee = amount > 100 ? 5 : 0;
    const totalAmount = amount + fee;
    // Process the transaction
    sender.balance = Number(sender.balance) - totalAmount;
    receiver.balance = Number(receiver.balance) + amount;
    yield sender.save();
    yield receiver.save();
    // Create transaction record
    const transaction = yield Transaction_model_1.Transaction.create({
        senderPhone,
        receiverPhone,
        amount,
        transactionType: "send-money",
        fee,
        status: "completed",
    });
    // Admin fee collection
    const admin = yield Auth_model_1.User.findOne({ role: "admin" });
    if (admin && typeof admin.balance === "number") {
        admin.balance = Number(admin.balance) + fee;
        yield admin.save();
        // Update system balance
        let systemBalance = yield SystemBalance_model_1.SystemBalance.findOne();
        if (!systemBalance) {
            systemBalance = new SystemBalance_model_1.SystemBalance({ totalMoney: fee });
        }
        else {
            systemBalance.totalMoney = Number(systemBalance.totalMoney) + fee;
        }
        yield systemBalance.save();
    }
    return transaction;
});
const cashOut = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { agentPhone, amount, password } = req.body;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const sender = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!sender) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender not found.");
    }
    const senderPhone = sender === null || sender === void 0 ? void 0 : sender.phone;
    //password test
    const isPasswordValid = yield bcrypt.compare(password, sender.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password incorrect! Try again.");
    }
    const agent = yield Auth_model_1.User.findOne({ phone: agentPhone });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Agent not found.");
    }
    // Fees calculation
    const agentIncome = amount * 0.01;
    const adminIncome = amount * 0.005;
    const totalFee = agentIncome + adminIncome;
    const totalAmount = amount + totalFee;
    if (sender.balance < totalAmount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Insufficient balance for cash-out.");
    }
    sender.balance -= totalAmount;
    yield sender.save();
    const transaction = yield Transaction_model_1.Transaction.create({
        senderPhone: senderPhone,
        receiverPhone: agentPhone,
        amount,
        transactionType: "cash-out",
        fee: totalFee,
        status: "completed",
    });
    agent.balance += amount;
    agent.income = (agent.income || 0) + agentIncome;
    yield agent.save();
    const admin = yield Auth_model_1.User.findOne({ role: "admin" });
    if (admin) {
        admin.balance += adminIncome;
        yield admin.save();
    }
    let systemBalance = yield SystemBalance_model_1.SystemBalance.findOne();
    if (!systemBalance) {
        systemBalance = new SystemBalance_model_1.SystemBalance({ totalMoney: 0 });
    }
    systemBalance.totalMoney -= amount;
    systemBalance.totalMoney += adminIncome;
    yield systemBalance.save();
    yield updateTotalMoney();
    return transaction;
});
// ========================== BALANCE INQUIRY ==========================
const balanceInquiry = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const userData = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const balance = userData.balance;
    return { balance };
});
// ========================== UPDATE TOTAL MONEY ==========================
const updateTotalMoney = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield Auth_model_1.User.find({ role: "user" });
    const agents = yield Auth_model_1.User.find({ role: "agent" });
    const admin = yield Auth_model_1.User.findOne({ role: "admin" });
    const userBalance = users.reduce((sum, user) => sum + user.balance, 0);
    const agentBalance = agents.reduce((sum, agent) => sum + agent.balance, 0);
    const adminBalance = admin ? admin.balance : 0;
    const newTotal = userBalance + agentBalance + adminBalance;
    let systemBalance = yield SystemBalance_model_1.SystemBalance.findOne();
    if (!systemBalance) {
        systemBalance = new SystemBalance_model_1.SystemBalance({ totalMoney: newTotal });
    }
    else {
        systemBalance.totalMoney = newTotal;
    }
    yield systemBalance.save();
    return systemBalance;
});
// ========================== CASH IN ==========================
const cashIn = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const { userPhone, amount, password } = req.body;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const agent = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!agent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Sender not found.");
    }
    const agentPhone = agent === null || agent === void 0 ? void 0 : agent.phone;
    //password test
    const isPasswordValid = yield bcrypt.compare(password, agent.password);
    if (!isPasswordValid) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Password incorrect! Try again.");
    }
    // Ensure agent has enough balance for the cash-in transaction
    if (agent.balance < amount) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "Agent has insufficient balance.");
    }
    const receiver = yield Auth_model_1.User.findOne({ phone: userPhone, isDeleted: false });
    if (!receiver) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    // Transfer money from agent to user
    receiver.balance += amount;
    agent.balance -= amount;
    yield receiver.save();
    yield agent.save();
    // Create transaction record for cash-in
    const transaction = yield Transaction_model_1.Transaction.create({
        senderPhone: agentPhone,
        receiverPhone: userPhone,
        amount,
        transactionType: "cash-in",
        fee: 0,
        status: "completed",
    });
    let systemBalance = yield SystemBalance_model_1.SystemBalance.findOne();
    if (!systemBalance) {
        systemBalance = yield SystemBalance_model_1.SystemBalance.create({ totalMoney: amount });
    }
    else {
        systemBalance.totalMoney += amount;
        yield systemBalance.save();
    }
    yield updateTotalMoney();
    return {
        message: "Cash-in transaction completed successfully.",
        transaction,
        newTotalMoney: systemBalance.totalMoney,
    };
});
// Get Last 100 Transactions of a User/Agent
const getLast100Transactions = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User not found.");
    }
    const userData = yield Auth_model_1.User.findOne({
        $or: [{ email: user.identifier }, { phone: user.identifier }],
    });
    if (!userData) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User not found.");
    }
    const transactions = yield Transaction_model_1.Transaction.find({
        $or: [{ senderPhone: userData.phone }, { receiverPhone: userData.phone }],
    })
        .sort({ createdAt: -1 })
        .limit(100);
    if (transactions.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No transactions found.");
    }
    return transactions;
});
// Admin Show All Transactions of User
const getTransactionsOfUser = (userPhone) => __awaiter(void 0, void 0, void 0, function* () {
    const transactions = yield Transaction_model_1.Transaction.find({ userPhone });
    if (!transactions) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "No transactions found for this user.");
    }
    return transactions;
});
exports.TransactionServices = {
    sendMoney,
    cashOut,
    balanceInquiry,
    cashIn,
    updateTotalMoney,
    getLast100Transactions,
    getTransactionsOfUser,
};
