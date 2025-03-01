import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";
import { TransactionServices } from "./Transaction.service";

const sendMoney = catchAsync(async (req, res) => {
  const result = await TransactionServices.sendMoney(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Money sent successfully.",
    data: result,
  });
});

const cashOut = catchAsync(async (req, res) => {
  const result = await TransactionServices.cashOut(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Cash-out successful.",
    data: result,
  });
});

const balanceInquiry = catchAsync(async (req, res) => {
  const result = await TransactionServices.balanceInquiry(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Balance fetched successfully.",
    data: result,
  });
});

const CashIn = catchAsync(async (req, res) => {
  const result = await TransactionServices.cashIn(req);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.message,
    data: result,
  });
});

const getLast100Transactions = catchAsync(async (req, res) => {
  const result = await TransactionServices.getLast100Transactions(req);
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
const updateTotalMoney = catchAsync(async (req, res) => {
  const result = await TransactionServices.updateTotalMoney();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Total money fetched successfully.",
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
  updateTotalMoney,
};
