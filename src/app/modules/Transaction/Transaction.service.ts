import { Transaction } from "./Transaction.model";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../Auth/Auth.model";
import * as bcrypt from "bcrypt";
import { SystemBalance } from "./SystemBalance.model";
import { Request } from "express";

const sendMoney = async (req: Request) => {
  const user = req.user;
  const { receiverPhone, amount, password } = req.body;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }

  const sender = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!sender) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender not found.");
  }
  const senderPhone = sender?.phone;

  //password test
  const isPasswordValid = await bcrypt.compare(password, sender.password);
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password incorrect! Try again."
    );
  }

  const receiver = await User.findOne({ phone: receiverPhone });
  if (!receiver) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Receiver not found.");
  }

  if (sender.balance < amount) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Insufficient balance.");
  }

  if (amount < 50) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Minimum amount 50 for send money."
    );
  }

  const fee = amount > 100 ? 5 : 0;
  const totalAmount = amount + fee;

  // Process the transaction
  sender.balance = Number(sender.balance) - totalAmount;
  receiver.balance = Number(receiver.balance) + amount;

  await sender.save();
  await receiver.save();

  // Create transaction record
  const transaction = await Transaction.create({
    senderPhone,
    receiverPhone,
    amount,
    transactionType: "send-money",
    fee,
    status: "completed",
  });

  // Admin fee collection
  const admin = await User.findOne({ role: "admin" });
  if (admin && typeof admin.balance === "number") {
    admin.balance = Number(admin.balance) + fee;
    await admin.save();

    // Update system balance
    let systemBalance = await SystemBalance.findOne();
    if (!systemBalance) {
      systemBalance = new SystemBalance({ totalMoney: fee });
    } else {
      systemBalance.totalMoney = Number(systemBalance.totalMoney) + fee;
    }
    await systemBalance.save();
  }

  return transaction;
};

const cashOut = async (req: Request) => {
  const user = req.user;
  const { agentPhone, amount, password } = req.body;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }

  const sender = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!sender) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender not found.");
  }
  const senderPhone = sender?.phone;

  //password test
  const isPasswordValid = await bcrypt.compare(password, sender.password);
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password incorrect! Try again."
    );
  }

  const agent = await User.findOne({ phone: agentPhone });
  if (!agent) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Agent not found.");
  }

  // Fees calculation
  const agentIncome = amount * 0.01;
  const adminIncome = amount * 0.005;
  const totalFee = agentIncome + adminIncome;
  const totalAmount = amount + totalFee;

  if (sender.balance < totalAmount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Insufficient balance for cash-out."
    );
  }

  sender.balance -= totalAmount;
  await sender.save();

  const transaction = await Transaction.create({
    senderPhone: senderPhone,
    receiverPhone: agentPhone,
    amount,
    transactionType: "cash-out",
    fee: totalFee,
    status: "completed",
  });

  agent.balance += amount;
  agent.income = (agent.income || 0) + agentIncome;
  await agent.save();

  const admin = await User.findOne({ role: "admin" });
  if (admin) {
    admin.balance += adminIncome;
    await admin.save();
  }

  let systemBalance = await SystemBalance.findOne();
  if (!systemBalance) {
    systemBalance = new SystemBalance({ totalMoney: 0 });
  }
  systemBalance.totalMoney -= amount;
  systemBalance.totalMoney += adminIncome;
  await systemBalance.save();
  await updateTotalMoney();

  return transaction;
};

// ========================== BALANCE INQUIRY ==========================
const balanceInquiry = async (req: Request) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const userData = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }
  const balance = userData.balance;

  return { balance };
};

// ========================== UPDATE TOTAL MONEY ==========================
const updateTotalMoney = async () => {
  const users = await User.find({ role: "user" });
  const agents = await User.find({ role: "agent" });
  const admin = await User.findOne({ role: "admin" });

  const userBalance = users.reduce((sum, user) => sum + user.balance, 0);
  const agentBalance = agents.reduce((sum, agent) => sum + agent.balance, 0);
  const adminBalance = admin ? admin.balance : 0;

  const newTotal = userBalance + agentBalance + adminBalance;

  let systemBalance = await SystemBalance.findOne();
  if (!systemBalance) {
    systemBalance = new SystemBalance({ totalMoney: newTotal });
  } else {
    systemBalance.totalMoney = newTotal;
  }

  await systemBalance.save();
  return systemBalance;
};

// ========================== CASH IN ==========================
const cashIn = async (req: Request) => {
  const user = req.user;
  const { userPhone, amount, password } = req.body;
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }

  const agent = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!agent) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Sender not found.");
  }
  const agentPhone = agent?.phone;

  //password test
  const isPasswordValid = await bcrypt.compare(password, agent.password);
  if (!isPasswordValid) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Password incorrect! Try again."
    );
  }

  // Ensure agent has enough balance for the cash-in transaction
  if (agent.balance < amount) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "Agent has insufficient balance."
    );
  }

  const receiver = await User.findOne({ phone: userPhone, isDeleted: false });
  if (!receiver) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }

  // Transfer money from agent to user
  receiver.balance += amount;
  agent.balance -= amount;

  await receiver.save();
  await agent.save();

  // Create transaction record for cash-in
  const transaction = await Transaction.create({
    senderPhone: agentPhone,
    receiverPhone: userPhone,
    amount,
    transactionType: "cash-in",
    fee: 0,
    status: "completed",
  });

  let systemBalance = await SystemBalance.findOne();
  if (!systemBalance) {
    systemBalance = await SystemBalance.create({ totalMoney: amount });
  } else {
    systemBalance.totalMoney += amount;
    await systemBalance.save();
  }

  await updateTotalMoney();
  return {
    message: "Cash-in transaction completed successfully.",
    transaction,
    newTotalMoney: systemBalance.totalMoney,
  };
};

// Get Last 100 Transactions of a User/Agent
const getLast100Transactions = async (req: Request) => {
  const user = req.user;
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found.");
  }
  const userData = await User.findOne({
    $or: [{ email: user.identifier }, { phone: user.identifier }],
  });
  if (!userData) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User not found.");
  }

  const transactions = await Transaction.find({
    $or: [{ senderPhone: userData.phone }, { receiverPhone: userData.phone }],
  })
    .sort({ createdAt: -1 })
    .limit(100);

  if (transactions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, "No transactions found.");
  }

  return transactions;
};

// Admin Show All Transactions of User
const getTransactionsOfUser = async (userPhone: string) => {
  const transactions = await Transaction.find({ userPhone });
  if (!transactions) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "No transactions found for this user."
    );
  }
  return transactions;
};

export const TransactionServices = {
  sendMoney,
  cashOut,
  balanceInquiry,
  cashIn,
  updateTotalMoney,
  getLast100Transactions,
  getTransactionsOfUser,
};
