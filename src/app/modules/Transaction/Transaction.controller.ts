import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TransactionServices } from "./Transaction.service";

const sendMoney = catchAsync(async (req, res) => {
  const { senderPhone, receiverPhone, amount } = req.body;
  const result = await TransactionServices.sendMoney(
    senderPhone,
    receiverPhone,
    amount
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully.",
    data: result,
  });
});

const cashOut = catchAsync(async (req, res) => {
  const { userPhone, amount, password, agentPhone } = req.body;
  const result = await TransactionServices.cashOut(
    userPhone,
    agentPhone,
    amount,
    password
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash-out successful.",
    data: result,
  });
});

const balanceInquiry = catchAsync(async (req, res) => {
  const { userPhone } = req.body;
  const result = await TransactionServices.balanceInquiry(userPhone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Balance fetched successfully.",
    data: result,
  });
});

const CashIn = catchAsync(async (req, res) => {
  const { userPhone, agentPhone, amount, password } = req.body;
  const result = await TransactionServices.cashIn(
    userPhone,
    agentPhone,
    amount,
    password
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getLast100Transactions = catchAsync(async (req, res) => {
  const { phone } = req.params;
  const result = await TransactionServices.getLast100Transactions(phone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transactions fetched successfully.",
    data: result,
  });
});

const getTransactionsOfUser = catchAsync(async (req, res) => {
  const { userPhone } = req.params;
  const result = await TransactionServices.getTransactionsOfUser(userPhone);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Transactions of the user fetched successfully.",
    data: result,
  });
});

export const TransactionControllers = {
  sendMoney,
  cashOut,
  balanceInquiry,
  CashIn,
  getLast100Transactions,
  getTransactionsOfUser,
};
